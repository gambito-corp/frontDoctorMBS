import React from 'react';
import Button from '../atoms/Button';

const FormGroup = ({ children, onSubmit, submitText = 'Enviar', loading = false }) => {
    return (
        <div className="group-formt">
            {children}
            <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="ml-2"
            >
                {loading ? 'Procesando...' : submitText}
            </Button>
        </div>
    );
};

export default FormGroup;
