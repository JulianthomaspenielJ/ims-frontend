import React, { useState } from 'react';
import { Plus, Minus, User, CreditCard, Shield } from 'lucide-react';

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab, disabled = false }) => (
  <button
    onClick={() => !disabled && setActiveTab(id)}
    disabled={disabled}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
      activeTab === id
        ? 'bg-blue-600 text-white shadow-lg'
        : 'bg-gray-100 text-gray-600'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
  >
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder, error, required = true, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const CheckboxField = ({ label, checked, onChange, error }) => (
  <div className="flex items-start space-x-3">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <div className="flex-1">
      <label className="text-sm font-medium text-gray-700 cursor-pointer">
        {label}
      </label>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  </div>
);

const RegistrationForm = () => {
  const initialFormState = {
    details: {
      companyName: '',
      adminName: '',
      userName: '',
      mailId: '',
      features: []
    },
    accounts: [
      { id: Date.now(), accountId: '', accountName: '', accessKey: '', secretKey: '', bucketName: '', prefix: '' }
    ],
    permissions: {}
  };

  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState(initialFormState);

  const resetForm = () => {
    setFormData(JSON.parse(JSON.stringify(initialFormState)));
    setActiveTab('details');
    setErrors({});
  };

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const featuresList = ["Cost", "Security", "Performance"];

  const toggleFeature = (feature) => {
    setFormData(prev => {
      const current = prev.details.features;
      const updated = current.includes(feature)
        ? current.filter(f => f !== feature)
        : [...current, feature];
      return {
        ...prev,
        details: { ...prev.details, features: updated }
      };
    });
  };

  const addAccount = () => {
    setFormData(prev => {
      const newAccount = { 
        accountId: '', 
        accountName: '', 
        accessKey: '', 
        secretKey: '', 
        bucketName: '', 
        prefix: '',
        username: '',
        password: ''
      };
      
      return {
        ...prev,
        accounts: [...prev.accounts, newAccount]
      };
    });
  };

  const removeAccount = (id) => {
    if (formData.accounts.length > 1) {
      setFormData(prev => ({
        ...prev,
        accounts: prev.accounts.filter((account) => account.id !== id)
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    const section = dataset.section;
    const index = dataset.index;

    setFormData(prev => {
      if (section === 'details') {
        return {
          ...prev,
          details: { ...prev.details, [name]: value }
        };
      } else if (section === 'accounts') {
        const newAccounts = [...prev.accounts];
        newAccounts[index] = { ...newAccounts[index], [name]: value };
        return { ...prev, accounts: newAccounts };
      }
      return prev;
    });
  };

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = (tab) => {
    const newErrors = {};

    if (tab === 'details') {
      if (!formData.details.adminName.trim()) {
        newErrors['details.adminName'] = 'Admin name is required';
      }
      if (!formData.details.userName.trim()) {
        newErrors['details.userName'] = 'User name is required';
      }
      if (!formData.details.mailId.trim()) {
        newErrors['details.mailId'] = 'Email is required';
      } else if (!validateEmail(formData.details.mailId)) {
        newErrors['details.mailId'] = 'Please enter a valid email address';
      }
      if (!formData.details.companyName.trim()) {
        newErrors['details.companyName'] = 'Company name is required';
      }
      if (formData.details.features.length === 0) {
        newErrors['details.features'] = 'At least one feature must be selected';
      }
    } else if (tab === 'accounts') {
      formData.accounts.forEach((account, index) => {
        if (!account.accountId.trim()) newErrors[`accounts.${index}.accountId`] = 'Account ID is required';
        if (!account.accountName.trim()) newErrors[`accounts.${index}.accountName`] = 'Account name is required';
        if (!account.accessKey.trim()) newErrors[`accounts.${index}.accessKey`] = 'Access key is required';
        if (!account.secretKey.trim()) newErrors[`accounts.${index}.secretKey`] = 'Secret key is required';
        
        // Add validation for username and password if Security or Performance is selected
        if (formData.details.features.some(feature => ['Security', 'Performance'].includes(feature))) {
          if (!account.username?.trim()) newErrors[`accounts.${index}.username`] = 'Username is required';
          if (!account.password?.trim()) newErrors[`accounts.${index}.password`] = 'Password is required';
        }

        if (formData.details.features.includes("Cost")) {
          if (!account.bucketName.trim()) newErrors[`accounts.${index}.bucketName`] = 'Bucket name is required';
          if (!account.prefix.trim()) newErrors[`accounts.${index}.prefix`] = 'Prefix is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm('details')) {
      setActiveTab('accounts');
    } else {
      alert('Please fill all required fields in Details tab.');
    }
  };

  const handleSubmit = async () => {
    if (validateForm('accounts')) {
      setIsLoading(true);
      try {
        // Prepare the payload according to the API requirements
        const payload = {
          details: formData.details,
          accounts: formData.accounts,
        };

        const response = await fetch('http://localhost:8000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          alert('Registration request submitted successfully!');
          console.log('API Response:', result);
          resetForm(); // Clear the form after successful submission
        } else {
          alert(`Registration failed: ${result.detail || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert(`Registration failed: ${error.message || 'Please try again later.'}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please fill all required fields in Accounts tab.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration Form</h1>
          <p className="text-gray-600">Please fill in all required fields to complete your registration.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 border-b pb-4 justify-center">
          <TabButton id="details" label="Details" icon={User} activeTab={activeTab} setActiveTab={setActiveTab}  />
          <TabButton id="accounts" label="Accounts" icon={CreditCard} activeTab={activeTab} setActiveTab={setActiveTab} disabled />
          <TabButton id="permissions" label="Permissions" icon={Shield} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 rounded-lg p-6 min-h-96">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Basic Details</h2>
              <div className="space-y-4">
              <InputField
                    label="User Name"
                    name="userName"
                    value={formData.details.userName}
                    onChange={handleChange}
                    placeholder="Enter user name"
                    error={errors['details.userName']}
                    data-section="details"
                  />
              <InputField
                    label="Email Address"
                    name="mailId"
                    value={formData.details.mailId}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    error={errors['details.mailId']}
                    data-section="details"
                  />
                  <InputField
                    label="Company Name"
                    name="companyName"
                    value={formData.details.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    error={errors['details.companyName']}
                    data-section="details"
                  />
                  <InputField
                    label="Admin Name"
                    name="adminName"
                    value={formData.details.adminName}
                    onChange={handleChange}
                    placeholder="Enter admin name"
                    error={errors['details.adminName']}
                    data-section="details"
                  />
                 
                 

                {/* Features Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Features <span className="text-red-500">*</span>
                  </label>
                  <div className="border rounded-lg p-3 bg-white shadow-sm">
                    {featuresList.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          checked={formData.details.features.includes(feature)}
                          onChange={() => toggleFeature(feature)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Button and Login Link */}
              <div className="mt-6 flex flex-col items-center space-y-4">
                <button
                  onClick={handleNext}
                  disabled={formData.details.features.length === 0}
                  className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed w-full max-w-xs"
                >
                  Next
                </button>
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a 
                    href="/login" 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Please login
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Accounts Tab */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
                <button
                  onClick={addAccount}
                  className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus size={14} />
                  <span>Add Account</span>
                </button>
              </div>

              {formData.accounts.map((account, index) => (
                <div key={account.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-medium text-gray-700">Account {index + 1}</h3>
                    {formData.accounts.length > 1 && (
                      <button
                        onClick={() => removeAccount(account.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors text-sm"
                      >
                        <Minus size={14} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField
                      label="Account ID"
                      name="accountId"
                      value={account.accountId}
                      onChange={handleChange}
                      placeholder="Enter account ID"
                      error={errors[`accounts.${index}.accountId`]}
                      data-section="accounts"
                      data-index={index}
                    />
                    <InputField
                      label="Account Name"
                      name="accountName"
                      value={account.accountName}
                      onChange={handleChange}
                      placeholder="Enter account name"
                      error={errors[`accounts.${index}.accountName`]}
                      data-section="accounts"
                      data-index={index}
                    />
                    <InputField
                      label="Access Key"
                      name="accessKey"
                      value={account.accessKey}
                      onChange={handleChange}
                      placeholder="Enter access key"
                      error={errors[`accounts.${index}.accessKey`]}
                      data-section="accounts"
                      data-index={index}
                    />
                    <InputField
                      label="Secret Key"
                      name="secretKey"
                      value={account.secretKey}
                      onChange={handleChange}
                      type="password"
                      placeholder="Enter secret key"
                      error={errors[`accounts.${index}.secretKey`]}
                      data-section="accounts"
                      data-index={index}
                    />
                    
                    {(formData.details.features.includes('Security') || formData.details.features.includes('Performance')) && (
                      <>
                        <InputField
                          label="Username"
                          name="username"
                          value={account.username || ''}
                          onChange={handleChange}
                          placeholder="Enter username"
                          error={errors[`accounts.${index}.username`]}
                          data-section="accounts"
                          data-index={index}
                        />
                        <InputField
                          label="Password"
                          name="password"
                          type="password"
                          value={account.password || ''}
                          onChange={handleChange}
                          placeholder="Enter password"
                          error={errors[`accounts.${index}.password`]}
                          data-section="accounts"
                          data-index={index}
                        />
                      </>
                    )}

                    {formData.details.features.includes("Cost") && (
                      <>
                        <InputField
                          label="Bucket Name"
                          name="bucketName"
                          value={account.bucketName}
                          onChange={handleChange}
                          placeholder="Enter bucket name"
                          error={errors[`accounts.${index}.bucketName`]}
                          data-section="accounts"
                          data-index={index}
                        />
                        <InputField
                          label="Prefix"
                          name="prefix"
                          value={account.prefix}
                          onChange={handleChange}
                          placeholder="Enter prefix (e.g., data/, images/)"
                          error={errors[`accounts.${index}.prefix`]}
                          data-section="accounts"
                          data-index={index}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Submit Button */}
              <div className="mt-8 flex flex-col items-center space-y-6">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed w-full max-w-xs text-base"
                >
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
                <p className="text-base text-gray-800">
                  Already have an account?{' '}
                  <a 
                    href="/login" 
                    className="text-blue-600 hover:underline font-semibold hover:text-blue-700 transition-colors"
                  >
                    Please login
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="text-center text-gray-500 py-10">
              Permissions are not required.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;

