$root = 'c:\Users\fs515\heysharlo\src'
$files = Get-ChildItem -Path $root -Recurse -Include *.js,*.jsx
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    if ($content -match 'localhost:5000') {
        # Replace host inside both 'single' and `backtick` strings
        $new = $content -replace "'http://localhost:5000", '${API_BASE}' -replace '`http://localhost:5000', '`${API_BASE}'
        $new = $new -replace "'\$\{API_BASE\}", '`${API_BASE}'
        # Add import after the last existing import line if not already present
        if ($new -notmatch "services/api") {
            $rel = $f.Directory.FullName.Substring($root.Length).TrimStart('\')
            $depth = if ($rel -eq '') { 1 } else { ($rel -split '\\').Count + 1 }
            $prefix = ('../' * $depth)
            $lines = $new -split "`r?`n"
            $lastImport = -1
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match "^import ") { $lastImport = $i }
            }
            if ($lastImport -ge 0) {
                $lines = $lines[0..$lastImport] + "import { API_BASE } from '$prefix/services/api';" + $lines[($lastImport+1)..($lines.Count-1)]
                $new = $lines -join "`n"
            }
        }
        Set-Content -Path $f.FullName -Value $new -NoNewline -Encoding UTF8
        Write-Output "UPDATED: $($f.FullName)"
    }
}