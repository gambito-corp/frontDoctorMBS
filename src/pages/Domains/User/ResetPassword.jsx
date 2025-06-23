import { Input } from '@gambito-corp/mbs-library';
import AuthLayout from '../../Layout/AuthLayout';

export default function ResetPassword() {
    return (
        <AuthLayout>
            <div className="max-w-md w-full p-8 bg-white rounded-md">
                <img src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/mbs-logo.svg" alt="Logo" className="h-10 mx-auto mb-6" />
                <form>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                        <Input type="password" name="password" id="password" required showPasswordToggle />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                        <Input type="password" name="password_confirmation" id="password_confirmation" required showPasswordToggle />
                    </div>

                    <button type="submit" className="w-full bg-[#0d3a54] text-white font-bold px-4 py-2 rounded-md hover:bg-[#093043]">
                        Restablecer contraseña
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}
