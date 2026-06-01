export const toggleTwoStepVerificationLayout = (
    username: string,
    code: string,
    action: "Enable" | "Disable"
) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${action} Two-Step Verification</title>
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
            #f97316,
            #ef4444
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
        color:#ea580c;
        font-size:12px;
        font-weight:700;
        letter-spacing:0.5px;
    "
>
ACCOUNT SECURITY
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
${action} Two-Step Verification
</h1>

<p
    style="
        margin:0;
        color:#6b7280;
        font-size:15px;
        line-height:1.8;
    "
>
Confirm this security change using the verification code below.
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
We received a request to
<strong>${action.toLowerCase()}</strong>
two-step verification for your Problem Forge account.
To continue with this security change, enter the verification code below.
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
        padding:18px 28px;
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
${code}
</span>

</div>

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
        color:#92400e;
        font-size:14px;
        line-height:1.8;
    "
>
This verification code will remain valid for
<strong>5 minutes</strong>.
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
        color:#7f1d1d;
        font-size:14px;
        line-height:1.8;
    "
>
If you did not request this change,
someone may be attempting to modify your account security settings.
Please secure your account immediately and review your recent account activity.
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
        margin:0;
        color:#4b5563;
        font-size:14px;
        line-height:1.8;
    "
>
For your protection, Problem Forge requires verification before enabling or disabling two-step verification.
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
If you did not initiate this request, you can safely ignore this email.
No changes will be made without successful verification.
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
Keeping developers secure while they learn, build, compete and solve problems.
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
`
}