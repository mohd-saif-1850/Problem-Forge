export const welcomeEmailLayout = (
  username: string
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Problem Forge</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f7fb;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
">

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:#f5f7fb;
    padding:32px 12px;
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
    border-radius:20px;
    overflow:hidden;
    border:1px solid #e5e7eb;
  "
>

<tr>
<td
  style="
    height:4px;
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
    padding:40px 24px 24px;
  "
>

<img
  src="https://res.cloudinary.com/dlzi244at/image/upload/v1780207062/Problem_forge_transparnt_logo_pbciwj.png"
  alt="Problem Forge"
  width="110"
  style="
    display:block;
    margin:0 auto 20px;
    border:0;
    outline:none;
  "
/>

<div
  style="
    display:inline-block;
    padding:6px 14px;
    border-radius:999px;
    background:#ecfdf5;
    color:#047857;
    font-size:11px;
    font-weight:600;
    letter-spacing:0.5px;
  "
>
ACCOUNT ACTIVATED
</div>

<h1
  style="
    margin:20px 0 10px;
    color:#111827;
    font-size:28px;
    line-height:1.3;
    font-weight:700;
  "
>
Welcome to Problem Forge
</h1>

<p
  style="
    margin:0;
    color:#6b7280;
    font-size:14px;
    line-height:1.8;
  "
>
Your account has been successfully verified and activated.
</p>

</td>
</tr>

<tr>
<td
  style="
    padding:0 30px 36px;
  "
>

<p
  style="
    margin:0 0 16px;
    color:#111827;
    font-size:15px;
    line-height:1.8;
  "
>
Hello <strong>${username}</strong>,
</p>

<p
  style="
    margin:0;
    color:#4b5563;
    font-size:14px;
    line-height:1.9;
  "
>
Your registration has been completed successfully.
You can now access Problem Forge and begin exploring coding challenges,
improving your problem-solving skills, and tracking your progress.
</p>

<div
  style="
    margin-top:28px;
    background:#f9fafb;
    border:1px solid #e5e7eb;
    border-radius:14px;
    padding:20px;
  "
>

<p
  style="
    margin:0 0 12px;
    color:#111827;
    font-size:14px;
    font-weight:600;
  "
>
Getting Started
</p>

<p
  style="
    margin:0;
    color:#4b5563;
    font-size:13px;
    line-height:2;
  "
>
• Explore available challenges<br>
• Practice consistently<br>
• Track your progress over time<br>
• Improve problem-solving techniques<br>
• Build stronger development skills
</p>

</div>

<div
  style="
    margin-top:24px;
    padding:18px;
    background:#f8fafc;
    border-left:4px solid #38bdf8;
    border-radius:10px;
  "
>

<p
  style="
    margin:0;
    color:#475569;
    font-size:13px;
    line-height:1.9;
  "
>
Your account is fully active and ready to use.
No further action is required.
</p>

</div>

<p
  style="
    margin:24px 0 0;
    color:#6b7280;
    font-size:13px;
    line-height:1.9;
  "
>
Thank you for joining Problem Forge.
We look forward to supporting your learning journey.
</p>

</td>
</tr>

<tr>
<td
  style="
    background:#fafafa;
    border-top:1px solid #e5e7eb;
    padding:24px;
    text-align:center;
  "
>

<p
  style="
    margin:0;
    color:#111827;
    font-size:13px;
    font-weight:600;
  "
>
Problem Forge
</p>

<p
  style="
    margin:8px 0 0;
    color:#6b7280;
    font-size:12px;
    line-height:1.8;
  "
>
Built for developers. Forged for problem solvers.
</p>

<p
  style="
    margin:16px 0 0;
    color:#9ca3af;
    font-size:11px;
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
