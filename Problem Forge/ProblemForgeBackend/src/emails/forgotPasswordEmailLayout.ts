export const forgotPasswordLayout = (
    username : string,
    resetLink : string
) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
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
            #f59e0b,
            #ef4444,
            #dc2626
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
        background:#fff7ed;
        color:#c2410c;
        font-size:12px;
        font-weight:700;
        letter-spacing:0.5px;
    "
>
ACCOUNT RECOVERY
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
Reset Your Password
</h1>

<p
    style="
        margin:0;
        color:#6b7280;
        font-size:15px;
        line-height:1.8;
    "
>
Secure your account and get back to building.
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
We received a request to reset the password for your
Problem Forge account. Click the button below to
create a new password.
</p>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
>
<tr>
<td align="center">

<a
    href="${resetLink}"
    style="
        display:inline-block;
        padding:16px 34px;
        background:#111827;
        color:#ffffff;
        text-decoration:none;
        border-radius:14px;
        font-size:16px;
        font-weight:700;
    "
>
Reset Password
</a>

</td>
</tr>
</table>

<div
    style="
        margin-top:32px;
        padding:18px;
        background:#fffbeb;
        border:1px solid #fde68a;
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
This password reset link will remain valid for
<strong style="color:#111827;">
10 minutes
</strong>.
</p>

</div>

<div
    style="
        margin-top:20px;
        padding:18px;
        background:#f9fafb;
        border:1px solid #e5e7eb;
        border-radius:12px;
    "
>

<p
    style="
        margin:0 0 10px;
        color:#111827;
        font-size:14px;
        font-weight:700;
    "
>
Button not working?
</p>

<p
    style="
        margin:0;
        color:#6b7280;
        font-size:13px;
        line-height:1.8;
        word-break:break-all;
    "
>
${resetLink}
</p>

</div>

<div
    style="
        margin-top:20px;
        padding:18px;
        background:#fff7ed;
        border-left:4px solid #f59e0b;
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
Password Recovery Notice
</strong>
<br><br>
If you requested this password reset,
click the button above to continue.

<br><br>

If you did not request a password reset,
you can safely ignore this email.
</p>

</div>

<div
    style="
        margin-top:20px;
        padding:18px;
        background:#fef2f2;
        border-left:4px solid #ef4444;
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
<strong style="color:#991b1b;">
Suspicious Activity?
</strong>
<br><br>
If you didn't request this password reset,
someone may have attempted to access your account.
We recommend reviewing your account security settings
and changing your password if necessary.
</p>

</div>

<div
    style="
        margin-top:20px;
        padding:18px;
        background:#eff6ff;
        border-left:4px solid #3b82f6;
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
<strong style="color:#1d4ed8;">
Security Tip
</strong>
<br><br>
Use a strong password that is unique to Problem Forge.
Avoid reusing passwords across multiple websites and
services.
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
Need help? Contact our support team if you continue
having trouble accessing your account.
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
`
}