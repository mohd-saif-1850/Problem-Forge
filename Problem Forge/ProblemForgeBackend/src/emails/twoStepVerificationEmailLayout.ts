export const twoStepVerificationLayout = (
username: string,
code: string
) => {
return `

<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Two-Step Verification</title>
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
    border:1px solid #dbe4ee;
  "
>

<tr>
<td
  style="
    height:6px;
    background:linear-gradient(
      90deg,
      #0ea5e9,
      #2563eb,
      #1d4ed8
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
    letter-spacing:0.5px;
  "
>
SECURITY CHECK
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
Two-Step Verification
</h1>

<p
  style="
    margin:0;
    color:#6b7280;
    font-size:15px;
    line-height:1.8;
  "
>
Protecting your account and your progress.
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
    margin:0 0 32px;
    color:#4b5563;
    font-size:16px;
    line-height:1.9;
  "
>
A sign-in attempt requires additional verification.
Use the security code below to continue accessing your
Problem Forge account.
</p>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
>
<tr>
<td align="center">

<div
  style="
    display:inline-block;
    padding:22px 30px;
    border:2px solid #bfdbfe;
    border-radius:18px;
    background:#eff6ff;
  "
>

<span
style="
color:#111827;
font-size:36px;
font-weight:800;
font-family:Consolas,Monaco,monospace;
letter-spacing:8px;
"

>

${code} </span>

</div>

</td>
</tr>
</table>

<div
  style="
    margin-top:32px;
    padding:18px;
    background:#f8fafc;
    border:1px solid #e2e8f0;
    border-radius:14px;
  "
>

<p
  style="
    margin:0;
    color:#475569;
    font-size:14px;
    line-height:1.8;
  "
>
This security code is valid for
<strong style="color:#111827;">
5 minutes
</strong>
and can only be used once.
</p>

</div>

<div
  style="
    margin-top:20px;
    padding:18px;
    background:#fef2f2;
    border-left:4px solid #dc2626;
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
<strong style="color:#111827;">
Security Warning
</strong>
<br><br>
Never share this code with anyone.
Anyone with access to this code may be able to access
your account.
Problem Forge will never ask for this code through
email, phone calls, messages, or social media.
</p>

</div>

<p
  style="
    margin:24px 0 0;
    color:#6b7280;
    font-size:14px;
    line-height:1.8;
  "
>
If this wasn't you, we recommend changing your password
immediately and reviewing your account activity.
</p>

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
Keeping developers secure while they learn,
build, and solve problems.
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
