export const newDeviceLoginLayout = (
username: string,
browser: string,
location: string,
ipAddress: string,
loginTime: string
) => {
return `

<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>New Device Login Detected</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f7fb;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:#f4f7fb;
    padding:30px 12px;
  "
>
<tr>
<td align="center">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    max-width:620px;
    background:#ffffff;
    border-radius:24px;
    overflow:hidden;
    border:1px solid #e5e7eb;
  "
>

<tr>
<td
  style="
    height:6px;
    background:linear-gradient(
      90deg,
      #06b6d4,
      #2563eb,
      #4f46e5
    );
  "
></td>
</tr>

<tr>
<td
  align="center"
  style="
    padding:40px 24px 10px;
  "
>

<img
src="https://res.cloudinary.com/dlzi244at/image/upload/v1780207062/Problem_forge_transparnt_logo_pbciwj.png"
alt="Problem Forge"
width="120"
style="
 display:block;
 border:0;
 outline:none;
 text-decoration:none;
 margin:0 auto 20px;
"
/>

<div
  style="
    display:inline-block;
    padding:8px 16px;
    border-radius:999px;
    background:#eff6ff;
    color:#2563eb;
    font-size:12px;
    font-weight:700;
    letter-spacing:.5px;
  "
>
SECURITY ALERT
</div>

<h1
  style="
    margin:24px 0 12px;
    color:#111827;
    font-size:34px;
    line-height:1.2;
    font-weight:800;
  "
>
New Device Login Detected
</h1>

<p
  style="
    margin:0;
    color:#6b7280;
    font-size:15px;
    line-height:1.8;
  "
>
Your account was accessed from a device we haven't seen before.
</p>

</td>
</tr>

<tr>
<td
  style="
    padding:20px 28px 40px;
  "
>

<p
  style="
    margin:0 0 20px;
    color:#111827;
    font-size:18px;
    line-height:1.8;
  "
>
Hello <strong>${username}</strong>,
</p>

<p
  style="
    margin:0 0 28px;
    color:#4b5563;
    font-size:16px;
    line-height:1.9;
  "
>
We detected a successful sign in to your Problem Forge account from a new device.
For your security, we're sharing the details below.
</p>

<div
  style="
    background:#f8fafc;
    border:1px solid #e2e8f0;
    border-radius:20px;
    overflow:hidden;
  "
>

<div
  style="
    padding:18px 22px;
    border-bottom:1px solid #e2e8f0;
  "
>
<div
  style="
    color:#64748b;
    font-size:12px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.6px;
  "
>
Device
</div>

<div
  style="
    margin-top:8px;
    color:#111827;
    font-size:16px;
    font-weight:600;
  "
>
${browser}
</div>
</div>

<div
  style="
    padding:18px 22px;
    border-bottom:1px solid #e2e8f0;
  "
>
<div
  style="
    color:#64748b;
    font-size:12px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.6px;
  "
>
Location
</div>

<div
  style="
    margin-top:8px;
    color:#111827;
    font-size:16px;
    font-weight:600;
  "
>
${location}
</div>
</div>

<div
  style="
    padding:18px 22px;
    border-bottom:1px solid #e2e8f0;
  "
>
<div
  style="
    color:#64748b;
    font-size:12px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.6px;
  "
>
IP Address
</div>

<div
  style="
    margin-top:8px;
    color:#111827;
    font-size:16px;
    font-weight:600;
    font-family:Consolas,Monaco,monospace;
  "
>
${ipAddress}
</div>
</div>

<div
  style="
    padding:18px 22px;
  "
>
<div
  style="
    color:#64748b;
    font-size:12px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.6px;
  "
>
Time
</div>

<div
  style="
    margin-top:8px;
    color:#111827;
    font-size:16px;
    font-weight:600;
  "
>
${loginTime}
</div>
</div>

</div>

<div
  style="
    margin-top:24px;
    padding:18px;
    background:#ecfeff;
    border-left:4px solid #06b6d4;
    border-radius:12px;
  "
>
<p
  style="
    margin:0;
    color:#164e63;
    font-size:14px;
    line-height:1.8;
  "
>
If this was you, no action is required. Your account remains secure and you can continue using Problem Forge normally.
</p>
</div>

<div
  style="
    margin-top:18px;
    padding:18px;
    background:#fef2f2;
    border-left:4px solid #dc2626;
    border-radius:12px;
  "
>
<p
  style="
    margin:0;
    color:#7f1d1d;
    font-size:14px;
    line-height:1.8;
  "
>
If you do not recognize this activity, we strongly recommend changing your password immediately and signing out of all active devices to secure your Problem Forge account.
</p>
</div>

<div
  style="
    margin-top:24px;
    padding:18px;
    background:#fafafa;
    border:1px solid #e5e7eb;
    border-radius:12px;
  "
>
<p
  style="
    margin:0;
    color:#4b5563;
    font-size:14px;
    line-height:1.8;
  "
>
This notification was sent automatically as part of our account security system to help keep your Problem Forge account protected.
</p>
</div>

</td>
</tr>

<tr>
<td
  style="
    border-top:1px solid #e5e7eb;
    background:#fafafa;
    padding:28px;
    text-align:center;
  "
>

<p
  style="
    margin:0;
    color:#111827;
    font-size:14px;
    font-weight:700;
  "
>
Problem Forge Security Center
</p>

<p
  style="
    margin:10px 0 0;
    color:#6b7280;
    font-size:12px;
    line-height:1.8;
  "
>
Keeping developers secure while they learn, build, compete and solve problems.
</p>

<p
  style="
    margin:18px 0 0;
    color:#9ca3af;
    font-size:12px;
  "
>
© ${new Date().getFullYear()} Problem Forge. All rights reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};
