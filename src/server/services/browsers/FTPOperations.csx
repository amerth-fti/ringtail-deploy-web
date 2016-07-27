// Overview of edge.js: http://tjanczuk.github.com/edge
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
using System.Diagnostics;

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
        {
            typeOfOperation = "DIRECTORY";
        }
        else
        {
            if(typeOfOperation == "VALIDATE")
            {
                return this.GetValidateFiles(input);
            }
        }

        return typeOfOperation == "DIRECTORY" ? this.GetRemoteBranches(input) : this.GetRemoteFiles(input);
    }

    string GetRemoteBranches(dynamic input)
    {
        return Helper.GetRemoteBranches(input);
    }
    string GetRemoteFiles(dynamic input)
    {
        return Helper.GetValidateLocation(input);
        //return Helper.GetRemoteFiles(input);
    }
    string GetValidateFiles(dynamic input)
    {
        return Helper.GetValidateLocation(input);
    }
}

// Utility class just to keep arguments clean
public class Options
{
    public string FtpHost { get; set; }
    public string FtpUser { get; set; }
    public string FtpPassword { get; set; }
    public string FtpProxyPort { get; set; }
    public string FtpProxyHost { get; set; }
    public string Branch { get; set; }
    public string CurrentVersion { get; set; }

    public Options(string ftpHost, string ftpUser, string ftpPassword, string ftpProxyHost, string ftpProxyPort, string branch, string currentVersion)
    {
        FtpHost = ftpHost;
        FtpUser = ftpUser;
        FtpPassword = ftpPassword;
        FtpProxyHost = ftpProxyHost;
        FtpProxyPort = ftpProxyPort;
        Branch = branch;
        CurrentVersion = currentVersion;
    }
}

public static class Helper
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
        //remoteList.RemoveAll(item => !item.Contains(".exe"));
        var jsonSerialiser = new JavaScriptSerializer();
        return jsonSerialiser.Serialize(remoteList);
    }

    public static string GetValidateLocation(dynamic input)
    {
        try
        {
            List<string> remoteList = ValidateRemoteLocation(input, WebRequestMethods.Ftp.ListDirectoryDetails);
            var jsonSerialiser = new JavaScriptSerializer();
            var result = jsonSerialiser.Serialize(remoteList);
            return result;
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return "{}";
    }


    private static Options GenerateOptionsFromDynamic(dynamic input)
    {
        Options options = new Options((string)input.ftpHost, (string)input.ftpUser, (string)input.ftpPassword,
            (string)input.ftpProxyHost, (string)input.ftpProxyPort, (string)input.branch, (string) input.currentVersion);

        //Options options = new Options((string)input.FtpHost, (string)input.FtpUser, (string)input.FtpPassword,
        //    (string)input.FtpProxyHost, (string)input.FtpProxyPort, (string)input.Branch, (string)input.CurrentVersion);

        return options;
    }

    private static List<string> GetRemoteList(dynamic input, string ftpRequestMethod)
    {
        try
        {
            Options options = GenerateOptionsFromDynamic(input);
            var request = FtpConnectionRequest(options);
            var proxyHost = String.Empty;

            try
            {
                proxyHost = options.FtpProxyHost;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);       
            }

            var isProxy = !string.IsNullOrEmpty(proxyHost);

            if (request != null)
                return GetRemoteListingJson(request, ftpRequestMethod, isProxy);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }

        return new List<string>();
    }

    private static List<string> ValidateRemoteLocation(dynamic input, string ftpRequestMethod)
    {
        var result = new List<string>();
        bool okOverall = false;

        try
        {
            Options options = GenerateOptionsFromDynamic(input);
            var request = FtpConnectionRequest(options);

            if (request != null)
            {
                result = GetDetailedRemoteListing(request, ftpRequestMethod);
                try
                {
                    if (result != null)
                    {
                        options.Branch = options.Branch + @"/Manifest.txt";
                        try
                        {
                            request = FtpConnectionRequest(options);
                            if (request != null)
                            {
                                var tmpResult = new List<string>();
                                okOverall = VerifyManifest(request, result, options, out tmpResult);
                                result = tmpResult;
                            }

                        }
                        catch(Exception ex)
                        {
                            Console.WriteLine(ex.ToString());
                            result = new List<string>();
                            result.Add("There is no manifest file in this location.");
                            okOverall = false;
                        }
                    }
                 }
                catch(Exception ex)
                {
                    result = new List<string>();
                    result.Add("Bad");
                    okOverall = false;
                    Console.WriteLine(ex);
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        if(okOverall)
        {
            result = new List<string>();
            result.Add("OK");
        }
        return result;
    }

    private static bool AllowBranchVersion(string current, string manifest) 
    {
        var cArray = current.Split('.');
        var mArray = manifest.Split('.');

        //mismatch, allow it
        if(cArray.Length != mArray.Length) 
        {
            return true;
        }

        for(var i = 0; i < cArray.Length; i++ )
        {
            var intCurrentVal = Int32.Parse(cArray[i]);
            var intManifestVal = Int32.Parse(mArray[i]);

            if(intCurrentVal == intManifestVal) 
            {
                continue;
            }

            else if(intCurrentVal > intManifestVal) 
            {
                return false;
            }

            return true;
        }

        //i don't know what happened, but allow it
        return true;
    }

    private static bool VerifyManifest(FtpWebRequest request, List<string> listing, Options options, out List<string> validationResult)
    {
        var okOverall = true;
        var manifestContents = GetManifestFileContents(request);
        validationResult = new List<string>();

        foreach (var x in manifestContents)
        {
            if (x.FileName == "Manifest.txt")
            {
                continue;
            }
            
            bool ringtailVersionOk = true;
            if(options.CurrentVersion != null && options.CurrentVersion != "0.0.0.0")
            {
                if(x.FileName.IndexOf("Ringtail_Main Ringtail8") >= 0)
                {
                    var allowIt = AllowBranchVersion(options.CurrentVersion, x.Version);
                    if(!allowIt) 
                    { 
                        validationResult.Add("This is an earlier version than what is already installed.");
                        ringtailVersionOk = false;
                    }
                }
            }

            bool fileExists = false;
            bool fileSizeMatch = false;
            foreach (var y in listing)
            {
                if (y.Contains(x.FileName))
                {
                    fileExists = true;

                    if (y.Contains(x.FileSize.ToString()))
                    {
                        fileSizeMatch = true;
                    }
                    else
                    {
                        var item = "The file size is incorrect for " + x.FileName;
                        if(item.Length > 75) 
                        {
                            item = item.Substring(0, 75)+ " ...";
                        }
                        validationResult.Add(item);
                    }
                }
            }

            if (!fileExists)
            {
                var item = "The location is missing " + x.FileName;
                if(item.Length > 75) 
                {
                    item = item.Substring(0, 75) + " ...";
                }
                validationResult.Add(item);
            }
            okOverall = okOverall ? fileExists && fileSizeMatch && ringtailVersionOk : false;
        }

        return okOverall;
    }

    public static FtpWebRequest FtpConnectionRequest(Options options)
    {
        var ftpUrl = string.Empty;

        if (string.IsNullOrEmpty(options.Branch))
            ftpUrl = options.FtpHost;
        else
        {
            ftpUrl = options.FtpHost.TrimEnd('/');
            ftpUrl = options.FtpHost + "/" + options.Branch.TrimStart('/');
            ftpUrl = ftpUrl.Replace(" ", "%20");
        }
        //Clean up the URL
        ftpUrl = ValidateAndFixFtp(ftpUrl);


        Uri uri = new Uri(ftpUrl, UriKind.Absolute);
        var request = (FtpWebRequest)WebRequest.Create(uri);
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
    /// <param name="isProxy"></param>
    /// <returns></returns>
    private static List<string> GetRemoteListingJson(WebRequest ftpRequest, string ftpRequestMethod, bool isProxy)
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
                    if (isProxy)
                    {
                        htmlResult += _line;
                    }
                    else
                    {
                        var slashIndex = _line.IndexOf("/");
                        if (slashIndex >= 0)
                        {
                            _line = _line.Substring(slashIndex + 1, _line.Length - (slashIndex + 1));
                        }

                    }

                    if (String.CompareOrdinal("Parent Directory", _line) != 0)
                        ftpListing.Add(_line);
                    _line = reader.ReadLine();
                }
            }
        }

        if (isProxy)
        {
            try
            {
                //parse html output via proxy
                HtmlAgilityPack.HtmlDocument doc = new HtmlAgilityPack.HtmlDocument();

                doc.LoadHtml(htmlResult);
                ftpListing.Clear();
                foreach (HtmlAgilityPack.HtmlNode node in doc.DocumentNode.SelectNodes("//a[@href]"))
                {
                    if (String.CompareOrdinal("Parent Directory", node.InnerText) != 0)
                        ftpListing.Add(node.InnerText);
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        return ftpListing;
    }


    /// <summary>
    /// Handle the FtpWebResponse and try to parse the HTML output in the event that a proxy returns
    /// HTML versus content.
    /// </summary>
    /// <param name="ftpRequest"></param>
    /// <param name="ftpRequestMethod"></param>
    /// <returns></returns>
    private static List<string> GetDetailedRemoteListing(WebRequest ftpRequest, string ftpRequestMethod)
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

        ftpListing = ParseFTPResult(ftpListing);

        return ftpListing;
    }

    private static List<string> ParseFTPResult(List<string> ftpListing)
    {
        var newList = new List<string>();
        bool include = false;
        // TODO: Add back in proper parsing for non-proxy

        for (int i = 0; i < ftpListing.Count; i++)
        {
            if (ftpListing[i].Contains("<PRE>"))
            {
                include = true;
                continue;
            }
            if (ftpListing[i].Contains("</PRE>"))
            {
                break;
            }

            if (include)
            {
                var fileInfo = FileItem.TryParse(ftpListing[i]);
                newList.Add(fileInfo.FileName + "|" + fileInfo.FileSize);

                if (fileInfo.FileName.ToLower() == "manifest.txt")
                {
                }
            }
        }

        return newList;
    }

    public static List<FileItem> GetManifestFileContents(WebRequest ftpRequest)
    {
        var ftpListing = new List<FileItem>();
        ftpRequest.Method = WebRequestMethods.Ftp.DownloadFile;
        FtpWebResponse response = (FtpWebResponse)ftpRequest.GetResponse();
        using (Stream responsestream = response.GetResponseStream())
        {
            using (StreamReader reader = new StreamReader(responsestream))
            {
                string _line = reader.ReadLine();
                while (!string.IsNullOrEmpty(_line))
                {
                    var line = _line.Replace("\"", "");
                    var splitLine = line.Split(':');
                    FileItem fi = new FileItem();
                    fi.FileName = splitLine[0];
                    long length = 0;
                    string version = "99.99.99.9999";

                    bool success = long.TryParse(splitLine[1], out length);

                    if(splitLine.Length > 2)
                    {
                        version = splitLine[2];
                    }

                    fi.Version = version;
                    
                    if(success)
                    {
                        fi.FileSize = length;
                        ftpListing.Add(fi);
                    }
                    _line = reader.ReadLine();
                }
            }
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

public class FileItem
{

    public static FileItem TryParse(string value)
    {
        //"Apr 13 2016 15:32    254059808 <A HREF=\"RingtailLegalApplicationServer_Frozen.exe\">RingtailLegalApplicationServer_Frozen.exe</A>"
        var fileItem = new FileItem();

        var leftSide = value.Split('<')[0];
        var fileSize = leftSide.Substring(18, leftSide.Length - 18);

        long realSize = 0;
        long.TryParse(fileSize, out realSize);

        fileItem.FileSize = realSize;


        var rightSide = value.Split('<')[1];
        var fileName = rightSide.Split('>')[1];

        fileItem.FileName = fileName;

        return fileItem;
    }

    public string FileName { get; set; }
    public string Version { get; set; }
    public long FileSize { get; set; }


    public override string ToString()
    {
        return String.Format("{0} | {1} | {2}", FileName, FileSize, Version);
    }
}
