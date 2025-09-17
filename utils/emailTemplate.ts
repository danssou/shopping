
export const generateEmailTemplate = ({
    userName,
    code,
    supportLink,
}: {
    userName?: string;
    code: string;
    supportLink?: string;
}) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 480px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
        <tr>
            <td style="background-color: #4a90e2; text-align: center; padding: 24px 0;">
                <span style="font-size: 36px; font-weight: 800; color: #fff; letter-spacing: 2px;">CODALWARE</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 32px 24px 24px 24px;">
                <p style="font-size: 16px; margin-bottom: 18px;">${userName ? `Hello <strong style=\"color: #4a90e2;\">${userName}</strong>,` : 'Hello,'}</p>
                <p style="font-size: 16px; margin-bottom: 24px;">Your verification code is:</p>
                <div style="text-align: center; margin: 24px 0;">
                    <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4a90e2; background: #f0f7ff; padding: 16px 32px; border-radius: 8px; border: 1px solid #d0e3ff;">${code}</span>
                </div>
                <p style="font-size: 15px; color: #666; margin-bottom: 18px;">Enter this code in the app to complete your sign-in. This code will expire in 10 minutes.</p>
                ${supportLink ? `<p style=\"font-size: 15px;\">Need help? <a href=\"${supportLink}\" style=\"color: #4a90e2; text-decoration: none;\">Contact support</a>.</p>` : ''}
                <p style="font-size: 15px; margin-top: 32px;">Best regards,<br><strong>Codalware Team</strong></p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f7ff; padding: 16px; text-align: center; font-size: 13px; color: #888;">
                Codalware ltd co. | 12 Adidogome, Togo
            </td>
        </tr>
    </table>
</div>
`;