$root = 'c:\Users\fs515\heysharlo\src'
$files = Get-ChildItem -Path $root -Recurse -Include *.js,*.jsx
foreach ($f in $files) {
    if ($f.Name -eq 'api.js' -and $f.DirectoryName -like '*\services') { continue }
    $content = Get-Content $f.FullName -Raw
    $new = $content
    # 1) Fix doubled slashes in generated import paths
    while ($new -match '\.\./\.\.///services') { $new = $new -replace '\.\./\.\.///services', '../../services' }
    while ($new -match '\.\./\.\./\.\.///services') { $new = $new -replace '\.\./\.\./\.\.///services', '../../../services' }
    # 2) Fix broken single-quoted URLs: ${API_BASE}/x'  ->  `${API_BASE}/x`
    $new = $new -replace "\$\{API_BASE\}(/[^\x60']*)'", '`${API_BASE}$1`'
    if ($new -ne $content) {
        Set-Content -Path $f.FullName -Value $new -NoNewline -Encoding UTF8
        Write-Output "FIXED: $($f.Name)"
    }
}