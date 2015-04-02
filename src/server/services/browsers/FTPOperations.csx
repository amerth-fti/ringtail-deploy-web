﻿// Overview of edge.js: http://tjanczuk.github.com/edge
//
// Use C# FTP WebRequest and FtpWebRequest to utilze Proxy and NTLM
//

//#r "System.Core.dll"
//#r "System.Web.Extensions.dll"
//#r "System.Xml.dll"
//#r "HtmlAgilityPack.dll"

using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using HtmlAgilityPack;

 // Required for edge to invoke the C# from Nodejs
    public class Startup
    {
        /// <summary>
        /// Pass in corresponding JavaScript object and specify an action ( DIRECTORY or FILE )
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<object> Invoke(dynamic input)
        {
            var typeOfOperation = (string)input.action;
            if (string.IsNullOrEmpty(typeOfOperation))
                typeOfOperation = "DIRECTORY";

            return typeOfOperation == "DIRECTORY" ? this.GetRemoteBranches(input) : this.GetRemoteFiles(input);
        }

        string GetRemoteBranches(dynamic input)
        {
            return Helper.GetRemoteBranches(input);
        }
        string GetRemoteFiles(dynamic input)
        {
            return Helper.GetRemoteBranches(input);
        }
    }

    // Utility class just to keep arguments clean
    public class Options
    {
        public string FtpHost { get; private set; }
        public string FtpUser { get; private set; }
        public string FtpPassword { get; private set; }
        public string FtpProxyPort { get; private set; }
        public string FtpProxyHost { get; private set; }
        public string Branch { get; private set; }

        public Options(string ftpHost, string ftpUser, string ftpPassword, string ftpProxyHost, string ftpProxyPort, string branch)
        {
            FtpHost = ftpHost;
            FtpUser = ftpUser;
            FtpPassword = ftpPassword;
            FtpProxyHost = ftpProxyHost;
            FtpProxyPort = ftpProxyPort;
            Branch = branch;
        }
    }

    internal static class Helper
    {

        public static string GetRemoteBranches(dynamic input)
        {
            var remoteList = GetRemoteList(input, WebRequestMethods.Ftp.ListDirectory);
            var jsonSerialiser = new JavaScriptSerializer();
            return jsonSerialiser.Serialize(remoteList);
        }

        public static string GetRemoteFiles(dynamic input)
        {
            List<string> remoteList = GetRemoteList(input, WebRequestMethods.Ftp.ListDirectoryDetails);
            remoteList.RemoveAll(item => !item.EndsWith(".exe"));
            var jsonSerialiser = new JavaScriptSerializer();
            return jsonSerialiser.Serialize(remoteList);
        }

        private static List<string> GetRemoteList(dynamic input, string ftpRequestMethod)
        {
            try
            {
                Options options = new Options((string)input.ftpHost, (string)input.ftpUser, (string)input.ftpPassword,
                    (string)input.ftpProxyHost, (string)input.ftpProxyPort, (string)input.branch);
                var request = FtpConnectionRequest(options);
                if (request != null)
                    return GetRemoteListingJson(request, ftpRequestMethod);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return new List<string>();
        }

        private static FtpWebRequest FtpConnectionRequest(Options options)
        {
            var ftpUrl = string.Empty;
            
            if (string.IsNullOrEmpty(options.Branch))
                ftpUrl = options.FtpHost;
            else
            {
                ftpUrl = options.FtpHost.TrimEnd('/');
                ftpUrl = options.FtpHost + "/" + options.Branch.TrimStart('/');
                Console.WriteLine(ftpUrl);
            }
            //Clean up the URL
            ftpUrl = ValidateAndFixFtp(ftpUrl);

            var request = (FtpWebRequest)WebRequest.Create(ftpUrl);
            request.Credentials = new NetworkCredential(options.FtpUser, options.FtpPassword);
            string proxy = null;
            // setup proxy details 
            if (!string.IsNullOrEmpty(options.FtpProxyHost))
            {
                if (!string.IsNullOrEmpty(options.FtpProxyPort))
                {
                    proxy = options.FtpProxyHost.TrimEnd('/', ':');
                    proxy = proxy + ":" + options.FtpProxyPort;
                }
                else
                {
                    proxy = options.FtpProxyHost;
                }

                request.Proxy = new WebProxy(proxy);
            }
            return request;
        }

        /// <summary>
        /// Handle the FtpWebResponse and try to parse the HTML output in the event that a proxy returns
        /// HTML versus content.
        /// </summary>
        /// <param name="ftpRequest"></param>
        /// <param name="ftpRequestMethod"></param>
        /// <returns></returns>
        private static List<string> GetRemoteListingJson(WebRequest ftpRequest, string ftpRequestMethod)
        {
            List<string> ftpListing = new List<string>();
            string htmlResult = String.Empty;
            ftpRequest.Method = ftpRequestMethod;
            FtpWebResponse response = (FtpWebResponse)ftpRequest.GetResponse();
            using (Stream responsestream = response.GetResponseStream())
            {
                using (StreamReader reader = new StreamReader(responsestream))
                {
                    string _line = reader.ReadLine();
                    while (!string.IsNullOrEmpty(_line))
                    {
                        htmlResult += _line;
                        if (String.CompareOrdinal("Parent Directory", _line) != 0)
                            ftpListing.Add(_line);
                        _line = reader.ReadLine();
                    }
                }
            }
            //parse html output via proxy
            HtmlAgilityPack.HtmlDocument doc = new HtmlAgilityPack.HtmlDocument();
            try
            {
                doc.LoadHtml(htmlResult);
                ftpListing.Clear();
                foreach (HtmlAgilityPack.HtmlNode node in doc.DocumentNode.SelectNodes("//a[@href]"))
                {
                    if (String.CompareOrdinal("Parent Directory", node.InnerText) != 0)
                        ftpListing.Add(node.InnerText);
                }

            }
            catch (Exception)
            {
            }

            return ftpListing;
        }

        private static bool IsValidFtpPath(string ftpPath)
        {
            bool result = false;

            try
            {
                Uri uri;
                if (Uri.TryCreate(ftpPath, UriKind.RelativeOrAbsolute, out uri))
                {
                    result = (uri.Scheme == Uri.UriSchemeFtp) && (uri.IsWellFormedOriginalString());
                }
            }
            catch (Exception ex) { }

            return result;
        }

        private static string ValidateAndFixFtp(string ftpPath)
        {
            if (IsValidFtpPath(ftpPath))
                return ftpPath;

            var originalPath = ftpPath;
            if (!ftpPath.StartsWith(Uri.UriSchemeFtp + Uri.SchemeDelimiter))
            {
                ftpPath = Uri.UriSchemeFtp + Uri.SchemeDelimiter + ftpPath;
                if (IsValidFtpPath(ftpPath))
                    return ftpPath;

                ftpPath = originalPath;
            }

            if (ftpPath.StartsWith(Uri.SchemeDelimiter))
            {
                ftpPath = Uri.UriSchemeFtp + ftpPath;
                if (IsValidFtpPath(ftpPath))
                    return ftpPath;

                ftpPath = originalPath;
            }

            if (Uri.CheckHostName(ftpPath) == UriHostNameType.Unknown)
            {
                // error
            }

            return ftpPath;
        }

        private static string GetFtpPort(ref string ftpPath)
        {
            Uri uri;
            if (Uri.TryCreate(ftpPath, UriKind.RelativeOrAbsolute, out uri))
            {
                string port = uri.Port.ToString();
                ftpPath = ftpPath.Replace(":" + port, "");
                return uri.Port.ToString();
            }

            return "21";
        }
    }