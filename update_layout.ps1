$path = 'd:\html\fun\Hostel Management\src\components\layout\AppLayout.tsx'
$content = Get-Content $path -Raw

$oldStaff = [regex]::Escape('  { to: '''/cleaning''', label: '''Housekeeping''', short: '''HK''' },
  { to: '''/reports''', label: '''Reports''', short: '''RP''', disabled: true }]')
$newStaff = '  { to:  /cleaning, label: Housekeeping, short: HK },
  { to: /medical, label: Medical centre, short: MC },
  { to: /announcements, label: Announcements, short: AN },
  { to: /fees, label: Fees and payments, short: FP },
  { to: /assets, label: Assets, short: AS },
  { to: /parcels, label: Parcels, short: PC },
  { to: /bookings, label: Bookings, short: BK },
  { to: /lostfound, label: Lost and found, short: LF },
  { to: /community, label: Community, short: CM },
  { to: /checkout, label: Checkout, short: CK },
  { to: /reports, label: Reports, short: RP }]'
$content = $content -replace $oldStaff, $newStaff

$oldTitle = [regex]::Escape('  if (pathname.startsWith(''/cleaning'')) return ''Housekeeping'';
  return ''Command center'';')
$newTitle = '  if (pathname.startsWith(/cleaning)) return Housekeeping;
  if (pathname.startsWith(/medical)) return Medical centre;
  if (pathname.startsWith(/announcements)) return Announcements;
  if (pathname.startsWith(/fees)) return Fees;
  if (pathname.startsWith(/assets)) return Assets;
  if (pathname.startsWith(/parcels)) return Parcels;
  if (pathname.startsWith(/bookings)) return Bookings;
  if (pathname.startsWith(/lostfound)) return Lost and found;
  if (pathname.startsWith(/community)) return Community;
  if (pathname.startsWith(/checkout)) return Checkout;
  if (pathname.startsWith(/reports)) return Reports;
  return Command center;'
$content = $content -replace $oldTitle, $newTitle

Set-Content -Path $path -Value $content -Encoding utf8
Write-Host AppLayout.tsx updated
