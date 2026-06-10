' Launches the TikTok bridge supervisor with NO visible window.
' Used by the Windows scheduled task so the bridge runs silently in the background.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = scriptDir
sh.Run "cmd /c """ & scriptDir & "\run-bridge-loop.bat""", 0, False
