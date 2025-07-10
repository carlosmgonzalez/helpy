import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from './drizzle';
import { BETTER_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { emailOTP } from 'better-auth/plugins';
import resend from './resend';

export const auth = betterAuth({
	socialProviders: {
		google: {
			prompt: 'select_account',
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}
	},
	emailAndPassword: {
		enabled: true
	},
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (type === 'forget-password') {
					await resend.emails.send({
						from: 'no-responder@helpy.work',
						to: [email],
						subject: 'Restablecer contraseña',
						html: `
							<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
								<div style="background-color: white; padding: 50px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: 1px solid #e0e0e0;">
									<div style="text-align: center; margin-bottom: 40px;">
										<h1 style="color: #2c3e50; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px;">Helpy</h1>
										<div style="width: 60px; height: 4px; background: linear-gradient(90deg, #3498db, #2ecc71); margin: 15px auto; border-radius: 2px;"></div>
										<h2 style="color: #7f8c8d; margin: 20px 0 0 0; font-size: 18px; font-weight: 400;">Restablecer contraseña</h2>
									</div>

									<div style="background-color: #ecf0f1; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #3498db;">
										<p style="color: #2c3e50; line-height: 1.7; margin: 0; font-size: 16px;">
											Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú quien solicitó este cambio, haz clic en el siguiente botón para continuar con el proceso.
										</p>
									</div>

									<div style="text-align: center; margin: 35px 0;">
										<a href="${BETTER_AUTH_URL}/auth/password/reset?otp=${otp}" style="display: inline-block; background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 3px 15px rgba(52, 152, 219, 0.3); transition: all 0.3s ease;">
											🔐 Restablecer mi contraseña
										</a>
									</div>

									<div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 30px 0;">
										<p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
											<strong>⚠️ Importante:</strong> Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios y tu cuenta seguirá siendo segura.
										</p>
									</div>

									<div style="border-top: 1px solid #ecf0f1; padding-top: 25px; margin-top: 40px;">
										<p style="color: #95a5a6; font-size: 13px; margin: 0; text-align: center; line-height: 1.5;">
											Este es un correo automático, por favor no respondas a este mensaje.<br>
											Si tienes alguna pregunta, visita nuestro centro de ayuda en <strong>helpy.work</strong>
										</p>
									</div>
								</div>
							</div>
						`
					});
				}
			}
		})
	]
});
