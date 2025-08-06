'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface CustomField {
  id: string;
  name: string;
  field_type: string;
  is_required: boolean;
  is_active: boolean;
  default_value?: string;
  description?: string
  dropdown?: string[];
}

interface ConsumerFieldValue {
  custom_field_id: string;
  value: string;
}

export default function CustomFieldsPage() {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [name, setName] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [isRequired, setIsRequired] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [defaultValue, setDefaultValue] = useState('');
  const [description, setDescription] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState('');
  const [consumerId, setConsumerId] = useState('');
  const [fieldValues, setFieldValues] = useState<ConsumerFieldValue[]>([]);
  const [assignValues, setAssignValues] = useState<ConsumerFieldValue[]>([]);

  const fetchCustomFields = async () => {
    const res = await api.get('/custom-fields');
    setCustomFields(res.data);
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  const handleCreate = async () => {
    const dropdown = dropdownOptions
      ? dropdownOptions.split(',').map((s) => s.trim())
      : undefined;

    await api.post('/custom-fields', {
      name,
      field_type: fieldType,
      is_required: isRequired,
      is_active: isActive,
      default_value: defaultValue,
      description,
      dropdown,
    });

    await fetchCustomFields();
    setName('');
    setFieldType('text');
    setIsRequired(false);
    setIsActive(true);
    setDefaultValue('');
    setDescription('');
    setDropdownOptions('');
  };

  const handleAssignValues = async () => {
    console.log("Submitting values:", assignValues);
    await api.post(`/custom-fields/consumer/${consumerId}/values`, {values: assignValues,});
    alert('Values assigned successfully');
  };

  const handleGetValues = async () => {
    const res = await api.get(`/custom-fields/consumer/${consumerId}/values`);
    setFieldValues(res.data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Custom Fields</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Create New Field</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Field Name"
            className="border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="border p-2"
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="dropdown">Dropdown</option>
          </select>
          <input
            type="text"
            placeholder="Default Value"
            className="border p-2"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {fieldType === 'dropdown' && (
            <input
              type="text"
              placeholder="Dropdown Options (comma separated)"
              className="border p-2 col-span-2"
              value={dropdownOptions}
              onChange={(e) => setDropdownOptions(e.target.value)}
            />
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setIsRequired(target.checked);
              }}
            />
            Required
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setIsActive(target.checked);
              }}
            />
            Active
          </label>
        </div>
        <button
          onClick={handleCreate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Field
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">All Fields</h2>
        <ul className="space-y-2">
          {customFields.map((field) => (
            <li key={field.id} className="border p-3 rounded">
              <div className="font-medium">{field.name}</div>
              <div className="text-sm text-gray-600">
                Type: {field.field_type} | Required: {field.is_required ? 'Yes' : 'No'} | Active:{' '}
                {field.is_active ? 'Yes' : 'No'}
              </div>
              {(field.dropdown ?? []).length > 0 && (
                <div className="text-sm text-gray-500">
                  Dropdown: {(field.dropdown ?? []).join(', ')}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Assign Field Values to Consumer</h2>
        <input
          type="text"
          placeholder="Consumer ID"
          className="border p-2 mb-2 w-full"
          value={consumerId}
          onChange={(e) => setConsumerId(e.target.value)}
        />

        {customFields.map((field) => (
          <div key={field.id} className="mb-2">
            <label className="block text-sm font-medium mb-1">{field.name}</label>
            <input
              type="text"
              className="border p-2 w-full"
              onChange={(e) => {
                const value = e.target.value;
                setAssignValues((prev) => {
                  const existing = prev.find((v) => v.custom_field_id === field.id);
                  if (existing) {
                    return prev.map((v) =>
                      v.custom_field_id === field.id ? { ...v, value } : v
                    );
                  } else {
                    return [...prev, { custom_field_id: field.id, value }];
                  }
                });
              }}
            />
          </div>
        ))}

        <button
          onClick={handleAssignValues}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Assign Values
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Get Consumer Field Values</h2>
        <input
          type="text"
          placeholder="Consumer ID"
          className="border p-2 mb-2 w-full"
          value={consumerId}
          onChange={(e) => setConsumerId(e.target.value)}
        />
        <button
          onClick={handleGetValues}
          className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Get Values
        </button>

        {fieldValues.length > 0 && (
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold mb-2">Field Values:</h3>
            <ul className="space-y-1">
              {fieldValues.map((fv) => (
                <li key={fv.custom_field_id}>
                  <span className="font-medium">{fv.custom_field_id}</span>: {fv.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
