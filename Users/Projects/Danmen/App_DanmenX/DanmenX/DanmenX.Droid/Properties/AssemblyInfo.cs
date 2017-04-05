using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using Android.App;

// General Information about an assembly is controlled through the following 
// set of attributes. Change these attribute values to modify the information
// associated with an assembly.
[assembly: AssemblyTitle("DanmenX")]				//プログラムの概要
[assembly: AssemblyDescription("")]					//プログラムの詳細な説明
[assembly: AssemblyConfiguration("")]				//
[assembly: AssemblyCompany("")]						//会社名
[assembly: AssemblyProduct("DanmenX")]				//プログラムの正式名称
[assembly: AssemblyCopyright("Copyright ©  2016")]	//著作権情報
[assembly: AssemblyTrademark("")]					//商標登録情報
[assembly: AssemblyCulture("")]
[assembly: ComVisible(false)]

// Version information for an assembly consists of the following four values:
//
//      Major Version
//      Minor Version 
//      Build Number
//      Revision
//
// You can specify all the values or you can default the Build and Revision Numbers 
// by using the '*' as shown below:
// [assembly: AssemblyVersion("1.0.*")]
[assembly: AssemblyVersion("1.0.0.0")]				//.NETアセンブリ用バージョン（.NET Frameworkのバージョン管理機能)
[assembly: AssemblyFileVersion("1.0.0.0")]			//win32ファイル・システム用のバージョン番号

// Add some common permissions, these can be removed if not needed
[assembly: UsesPermission(Android.Manifest.Permission.Internet)]
[assembly: UsesPermission(Android.Manifest.Permission.WriteExternalStorage)]
