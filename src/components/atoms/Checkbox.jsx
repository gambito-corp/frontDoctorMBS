import React from 'react';

const Checkbox = ({
                      id,
                      checked,
                      onChange,
                      label,
                      value,
                      className = ''
                  }) => {
    return (
        <label className={`inline-flex items-center ${className}`}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                value={value}
                className="focus:border-tema1 focus:ring-tema1 rounded border-gray-300 text-indigo-600 checkbox-form"
            />
            <span className="ml-2">{label}</span>
        </label>
    );
};

export default Checkbox;
