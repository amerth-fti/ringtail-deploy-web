package org.fti;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPHTTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPConnectionClosedException;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.commons.net.io.CopyStreamEvent;
import org.apache.commons.net.io.CopyStreamListener;
import com.google.gson.Gson;
import org.apache.commons.cli.*;
import org.apache.commons.io.FilenameUtils;


public final class FtpOperations {

	private static String FtpHost;
	private static String FtpUser;
	private static int FtpPort = 0;
	private static String FtpPassword;
	private static int FtpProxyPort;
	private static String FtpProxyHost;
	private static String FtpProxyUser;
	private static String FtpProxyPassword;
	private static String RemotePath;
	private static String SaveFilePath;
	
	private static String Encoding = null;
	
	public static void main(String[] args) {
		
		boolean error = false;
		boolean binaryTransfer = true;
		// create the parser
		CommandLineParser parser = new DefaultParser();
		CommandLine cmdLineOpts = null;
        
		final FTPClient ftp;
        final FTPClientConfig config = new FTPClientConfig();
        
		Options options = new Options();
		options.addOption("l", false, "remote list");
		options.addOption("ld", false, "remote list with details");
		       
		options.addOption(Option.builder("un").hasArg().desc("ftp user name").argName("FtpUser").build());
		options.addOption(Option.builder("pw").hasArg().desc("ftp user password").argName("FtpPassword").build());
		options.addOption(Option.builder("url").hasArg().desc("ftp path").argName("FtpHost").required().build());
		options.addOption(Option.builder("ph").hasArg().desc("ftp user name").argName("FtpProxyHost").build());
		options.addOption(Option.builder("pp").hasArg().desc("ftp user name").argName("ftpProxyPort").build());
		options.addOption(Option.builder("pu").hasArg().desc("Proxy user name").argName("FtpProxyUser").build());
		options.addOption(Option.builder("pup").hasArg().desc("Proxy password").argName("ftpProxyPassword").build());
		options.addOption(Option.builder("r").hasArg().desc("Remote ftp path").required().argName("remotePath").build());
		options.addOption(Option.builder("sf").hasArg().desc("download and save file").argName("saveFilePath").build());
		
		try {
			 //parse the command line arguments
			 cmdLineOpts = parser.parse( options, args );
		 }
		 catch( ParseException exp ) {
			 System.err.println( "Parsing failed.  Reason: " + exp.getMessage() );
			 return;
		 }
		 
		// Parse args
		if( cmdLineOpts.hasOption( "r" ) ) {
			RemotePath = cmdLineOpts.getOptionValue( "r" );
		 }
		 
		 if( cmdLineOpts.hasOption( "url" ) ) {
			 FtpHost = cmdLineOpts.getOptionValue( "url" );
		 }
		 if( cmdLineOpts.hasOption( "pw" ) ) {
			 FtpPassword = cmdLineOpts.getOptionValue( "pw" );
		 }
		 if( cmdLineOpts.hasOption( "un" ) ) {
			 FtpUser = cmdLineOpts.getOptionValue( "un" );
		 }
		 
		 if( cmdLineOpts.hasOption( "ph" ) ) {
			 FtpProxyHost = cmdLineOpts.getOptionValue( "ph" );
		 }
		 
		 if( cmdLineOpts.hasOption( "pu" ) ) {
			 FtpProxyUser = cmdLineOpts.getOptionValue( "pu" );
		 }
		 if( cmdLineOpts.hasOption( "pup" ) ) {
			 FtpProxyPassword = cmdLineOpts.getOptionValue( "pup" );
		 }
		 
		 if( cmdLineOpts.hasOption( "pp" ) ) {
			 String tempPort = cmdLineOpts.getOptionValue( "pp" );
			 if(tempPort!=null){
				 try{
					 FtpProxyPort = Integer.parseInt(tempPort);
				 }
				 catch(NumberFormatException exp ){
					 System.err.println( "Proxy port could not be parsed ( setting to 8080).  Reason: " + exp.getMessage() );
					 FtpProxyPort = 8080;
				 }
			 }
		 }
		 
		 if( cmdLineOpts.hasOption( "sf" ) ) {
			 SaveFilePath = cmdLineOpts.getOptionValue( "sf" );
		 }
		 
		 // Create the ftp client
		 if(FtpProxyHost !=null) {
             ftp = new FTPHTTPClient(FtpProxyHost, FtpProxyPort, FtpProxyUser, FtpProxyPassword);
         }
         else {
             ftp = new FTPClient();
         }
		 
		 ftp.setCopyStreamListener(createListener());
	     ftp.setControlKeepAliveTimeout(300); // 5 minutes
	     ftp.setControlKeepAliveReplyTimeout(300);
	     if (Encoding != null) {
	    	 ftp.setControlEncoding(Encoding);
	     }
	    
	     ftp.setListHiddenFiles(true);
	     // suppress login details
	     //ftp.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(System.out), true));
	     config.setUnparseableEntries(false);
		 
	     connectToFTP(ftp);
__main:
		try {
			if (!ftp.login(FtpUser, FtpPassword))
			{
			     ftp.logout();
			     error = true;
			     break __main;
			}
			
			//System.out.println("Remote system is " + ftp.getSystemType());
	    	 
			if (binaryTransfer) {
                ftp.setFileType(FTP.BINARY_FILE_TYPE);
            } else {
                // in theory this should not be necessary as servers should default to ASCII
                // but they don't all do so - see NET-500
                ftp.setFileType(FTP.ASCII_FILE_TYPE);
            }
	    	 
			ftp.enterLocalPassiveMode();
			
			if( cmdLineOpts.hasOption( "ld" ) || cmdLineOpts.hasOption( "l" )) {
				List<String> fileName = new ArrayList<String>();
				for (FTPFile f : ftp.listFiles(RemotePath)) {
					String file = f.getName();
					if(!file.equalsIgnoreCase(".") && !file.equalsIgnoreCase("..")){
						if(cmdLineOpts.hasOption( "ld" )){
							fileName.add(file + "|" + f.getSize());
						}
						else{
							fileName.add(file);
						}
					}
				}

				 Gson gson = new Gson();
				 // convert your list to json
				 String jsonRemoteList = gson.toJson(fileName);
				 // print your generated json
				 System.out.println(jsonRemoteList);
			}
			
			if (SaveFilePath != null && RemotePath != null)
            {
                // Hack around path and space issues with this code
                String path = FilenameUtils.getPath(RemotePath);
                String file = FilenameUtils.getName(RemotePath);
                
                String cwd = ftp.printWorkingDirectory();
                System.out.println(cwd);
                ftp.changeWorkingDirectory(path);
                cwd = ftp.printWorkingDirectory();
                System.out.println(cwd);
                for (FTPFile f : ftp.listFiles()) {
                	System.out.println(f.getName());
                	 if (!f.isFile()) {
                         continue;
                     }
                	 
                	 if(f.getName().equalsIgnoreCase(file)){
                		//get output stream
                         OutputStream output;
                         output = new FileOutputStream(SaveFilePath);
                         //get the file from the remote system
                         ftp.retrieveFile(f.getName(), output);
                         //close output stream
                         output.close();
                         break;
                	 }
                }
            }

		}catch (FTPConnectionClosedException e){
            error = true;
            System.err.println("Server closed connection.");
            e.printStackTrace();
        }
        catch (IOException e){
            error = true;
            e.printStackTrace();
        }
        finally{
            if (ftp.isConnected())
            {
                try
                {
                    ftp.disconnect();
                }
                catch (IOException f){}
            }
        }
	     
	     System.exit(error ? 1 : 0);
	}



	private static void connectToFTP(final FTPClient ftp) {
		try{
	            int reply;
	            if (FtpPort > 0) {
	                ftp.connect(FtpHost, FtpPort);
	            } else {
	                ftp.connect(FtpHost);
	            }
	           // System.out.println("Connected to " + FtpHost + " on " + (FtpPort>0 ? FtpPort : ftp.getDefaultPort()));

	            // success.
	            reply = ftp.getReplyCode();

	            if (!FTPReply.isPositiveCompletion(reply))
	            {
	                ftp.disconnect();
	                System.err.println("FTP server refused connection.");
	                System.exit(1);
	            }
	        }
	        catch (IOException e)
	        {
	            if (ftp.isConnected())
	            {
	                try
	                {
	                    ftp.disconnect();
	                }
	                catch (IOException f)
	                {
	                    // do nothing
	                }
	            }
	            System.err.println("Could not connect to server.");
	            //e.printStackTrace();
	            System.exit(1);
	        }
	}
	
	
	
	private static CopyStreamListener createListener(){
        return new CopyStreamListener(){
            private long megsTotal = 0;

            @Override
            public void bytesTransferred(CopyStreamEvent event) {
                bytesTransferred(event.getTotalBytesTransferred(), event.getBytesTransferred(), event.getStreamSize());
            }

            @Override
            public void bytesTransferred(long totalBytesTransferred,
                    int bytesTransferred, long streamSize) {
                long megs = totalBytesTransferred / 1000000;
                for (long l = megsTotal; l < megs; l++) {
                    System.err.print("#");
                }
                megsTotal = megs;
            }
        };
    }

}
