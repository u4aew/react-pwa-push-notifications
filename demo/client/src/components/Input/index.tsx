import React from "react";

const TextInput = ({
                       id,
                       placeholder,
                       value,
                       onChange
                   }: { id: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div className="field">
        <input id={id} placeholder={placeholder} value={value} onChange={onChange} required type="text"/>
    </div>
);

export default TextInput
