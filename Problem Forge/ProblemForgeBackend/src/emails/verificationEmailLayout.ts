export const verifyEmailLayout = (
  username: string,
  otp: string
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verify Your Email</title>
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
      #38bdf8,
      #8b5cf6,
      #ec4899
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
    background:#f5f3ff;
    color:#7c3aed;
    font-size:12px;
    font-weight:700;
    letter-spacing:0.5px;
  "
>
WELCOME TO PROBLEM FORGE
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
Verify Your Email
</h1>

<p
  style="
    margin:0;
    color:#6b7280;
    font-size:15px;
    line-height:1.8;
  "
>
Built for developers. Forged for problem solvers.
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
Use the verification code below to verify your
Problem Forge account and continue your journey.
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
    padding:18px 26px;
    border:1px solid #e5e7eb;
    border-radius:18px;
    background:#fafafa;
  "
>

<span
  style="
    color:#111827;
    font-size:32px;
    font-weight:800;
    font-family:Consolas,Monaco,monospace;
    letter-spacing:4px;
  "
>
${otp}
</span>

</div>

</td>
</tr>
</table>

<div
  style="
    margin-top:32px;
    padding:18px;
    background:#f9fafb;
    border:1px solid #e5e7eb;
    border-radius:14px;
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
This verification code will remain valid for
<strong style="color:#111827;">
10 minutes
</strong>.
</p>

</div>

<div
  style="
    margin-top:20px;
    padding:18px;
    background:#faf5ff;
    border-left:4px solid #8b5cf6;
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
Security Notice
</strong>
<br><br>
Never share this code with anyone.
Problem Forge will never ask for your OTP through email,
phone calls, messages, or social media.
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
If you didn't request this verification,
you can safely ignore this email.
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
Problem Forge
</p>

<p
  style="
    margin:10px 0 0;
    color:#6b7280;
    font-size:12px;
    line-height:1.8;
  "
>
A platform where developers learn,
practice, and master problem solving.
</p>

<p
  style="
    margin:18px 0 0;
    color:#9ca3af;
    font-size:12px;
  "
>
© 2026 Problem Forge. All rights reserved.
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