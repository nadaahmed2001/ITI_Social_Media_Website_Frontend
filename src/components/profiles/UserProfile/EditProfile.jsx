// // src/components/UserProfile/EditProfile.js
// import React, { useState, useEffect } from 'react';
// import { updateAccount } from '../../../services/api';
// import EditIcon from '@mui/icons-material/Edit';
// import './EditProfile.css'; // Create this CSS file

// const EditProfile = ({ initialData, onUpdateSuccess }) => {
//     const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     headline: '',
//     bio: '',
//     github_url: '',
//     leetcode_username: '',
//     linkedin_url: '',
//     hackerrank_username: '',
//     website_url: '', 
//     location: '',
//     });
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     useEffect(() => {
//         if (initialData) {
//         // Populate form only with fields present in initialData
//         const initialFormData = {};
//         for (const key in formData) {
//             if (initialData.hasOwnProperty(key)) {
//                 initialFormData[key] = initialData[key] || ''; // Use empty string if null/undefined
//             }
//         }
//         setFormData(prev => ({ ...prev, ...initialFormData }));
//     }
//   }, [initialData]); // Rerun when initialData changes


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setError(''); // Clear error on change
//     setSuccess(''); // Clear success on change
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await updateAccount(formData);
//       setSuccess('Profile updated successfully!');
//       if (onUpdateSuccess) {
//         onUpdateSuccess(response.data); // Pass updated data back to parent
//       }
//     } catch (err) {
//       console.error("Profile update error:", err.response?.data || err.message);
//       setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper for input fields
//   const renderInput = (name, label, type = 'text') => (
//     <div className="form-group">
//       <label htmlFor={name}>{label}</label>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         value={formData[name]}
//         onChange={handleChange}
//         disabled={isLoading}
//       />
//     </div>
//   );

//   return (
//     <div className="edit-profile-container section-container">
//       <h2><EditIcon /> Edit Profile</h2>
//       <form onSubmit={handleSubmit}>
//         {error && <p className="error-message">{error}</p>}
//         {success && <p className="success-message">{success}</p>}

//         <div className="form-section">
//           <h3>Basic Info</h3>
//           {renderInput('first_name', 'First Name')}
//           {renderInput('last_name', 'Last Name')}
//           {renderInput('headline', 'Headline')}
//           <div className="form-group">
//             <label htmlFor="bio">Bio</label>
//             <textarea
//               id="bio"
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               rows="4"
//               disabled={isLoading}
//             />
//           </div>
//           {renderInput('location', 'Location')}
//         </div>

//         <div className="form-section">
//           <h3>Links</h3>
//           {renderInput('github_url', 'GitHub Profile URL')}
//           {renderInput('leetcode_username', 'LeetCode Username')}
//           {renderInput('linkedin_url', 'LinkedIn Profile URL')}
//           {renderInput('hackerrank_username', 'HackerRank Username')}
//           {renderInput('website_url', 'Personal Portfolio URL')}
//            {/* Add other links like twitter_url, stackoverflow_url if needed */}
//         </div>

//         <button type="submit" className="submit-button" disabled={isLoading}>
//           {isLoading ? 'Saving...' : 'Update Profile'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProfile;

// src/components/UserProfile/EditProfile.jsx (Adjust path)
import React, { useState, useEffect } from 'react';
// Use the API function sending JSON
import { updateAccount } from '../../../services/api'; // Adjust path
import { useFormik } from 'formik';
import * as Yup from 'yup';
// Import Heroicons
import { PencilSquareIcon, LinkIcon } from '@heroicons/react/24/outline';

// --- Reusable Input/Textarea Components (Tailwind styled) ---
const InputField = ({ id, name, label, type = 'text', value, onChange, onBlur, error, helperText, disabled, placeholder, required }) => (
  <div>
    <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id || name}
      name={name}
      value={value || ''} // Handle null/undefined
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={placeholder || ''}
      className={`block w-full border ${
        error ? 'border-red-400' : 'border-gray-300' // Use lighter red for border maybe
      } rounded-md shadow-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white
         focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 focus:border-primary-500
         disabled:opacity-60 disabled:bg-gray-100 transition duration-150 ease-in-out`}
    />
    {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
  </div>
);

const TextareaField = ({ id, name, label, rows = 4, value, onChange, onBlur, error, helperText, disabled, placeholder, required }) => (
    <div>
      <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
         {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id || name}
        name={name}
        rows={rows}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder || ''}
        className={`block w-full border ${
            error ? 'border-red-400' : 'border-gray-300'
        } rounded-md shadow-sm px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white
           focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 focus:border-primary-500
           disabled:opacity-60 disabled:bg-gray-100 transition duration-150 ease-in-out resize-vertical min-h-[100px]`} // Increased min-height
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
// --- End Reusable Components ---


// Edit Profile Component
const EditProfile = ({ initialData, onUpdateSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); // General API errors
    const [success, setSuccess] = useState(''); // For success message

    // --- Formik Setup ---
    const validationSchema = Yup.object({ // Keep or adjust validation
        first_name: Yup.string().max(200, 'Max 200 chars'),
        last_name: Yup.string().max(200, 'Max 200 chars'),
        headline: Yup.string().max(200, 'Max 200 chars'),
        bio: Yup.string(),
        location: Yup.string().max(200, 'Max 200 chars'),
        github_url: Yup.string().url('Invalid URL').nullable(),
        leetcode_username: Yup.string().max(100).nullable(),
        linkedin_url: Yup.string().url('Invalid URL').nullable(),
        hackerrank_username: Yup.string().max(200).nullable(),
        website_url: Yup.string().url('Invalid URL').nullable(),
    });

    const formik = useFormik({
        initialValues: { // Form fields
            first_name: '', last_name: '', headline: '', bio: '',
            location: '', github_url: '', leetcode_username: '',
            linkedin_url: '', hackerrank_username: '', website_url: '',
        },
        validationSchema,
        enableReinitialize: true, // Update form if initialData changes
        onSubmit: async (values) => {
            setIsLoading(true); setError(''); setSuccess('');
            // --- Prepare only changed values for PATCH/PUT ---
            const changedValues = {};
            let hasChanges = false;
            Object.keys(values).forEach(key => {
                const initialVal = initialData?.[key] || '';
                const currentVal = values[key] || ''; // Treat null/undefined as empty string for comparison
                if (currentVal !== initialVal) {
                    // Send null for empty optional fields if backend requires null over empty string
                    const isEmptyOptional = currentVal === '' && ['github_url', 'linkedin_url', 'website_url', 'headline', 'location', 'bio', 'leetcode_username', 'hackerrank_username'].includes(key);
                    changedValues[key] = isEmptyOptional ? null : currentVal;
                    hasChanges = true;
                }
            });
            // --- End Prepare changed values ---

            if (!hasChanges) {
                 setSuccess("No changes detected to save."); setIsLoading(false); return;
            }
            console.log("Submitting profile changes:", changedValues);

            try {
                // Use the updateAccount function that sends JSON
                const response = await updateAccount(changedValues); // Send only changed values
                setSuccess('Profile updated successfully!');
                if (onUpdateSuccess) { onUpdateSuccess(response.data); }
                formik.resetForm({ values: { ...formik.values, ...response.data } }); // Update formik state with saved data
            } catch (err) { console.error("Profile update error:", err.response?.data || err.message);}
            finally { setIsLoading(false); }
        },
    });

    // Effect to load initial data into formik
    useEffect(() => {
        if (initialData) {
            const formValues = {};
             for (const key in formik.initialValues) {
                 if (initialData.hasOwnProperty(key)) { formValues[key] = initialData[key] || ''; }
             }
             formik.setValues(formValues, false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    return (
        // Use Tailwind classes for main container styling
        <div className="p-6 bg-white border border-gray-200 rounded-md shadow-sm">
            {/* Header */}
            <h2 className="flex items-center text-xl font-semibold font-title text-gray-800 mb-6 pb-3 border-b border-gray-200"> {/* Use font-title */}
                <PencilSquareIcon className="w-6 h-6 mr-2 text-primary-600"/> Edit Profile
            </h2>

            {/* General Error/Success Messages */}
            {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">{error}</div>}
            {success && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md">{success}</div>}

            <form onSubmit={formik.handleSubmit} noValidate>
                {/* Basic Info Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basics</h3>
                    <div className="space-y-5"> {/* Increased spacing */}
                        {/* Use InputField component */}
                        <InputField label="First Name" name="first_name" {...formik.getFieldProps('first_name')} error={formik.touched.first_name && formik.errors.first_name} disabled={isLoading} />
                        <InputField label="Last Name" name="last_name" {...formik.getFieldProps('last_name')} error={formik.touched.last_name && formik.errors.last_name} disabled={isLoading}/>
                        <InputField label="Headline" name="headline" {...formik.getFieldProps('headline')} error={formik.touched.headline && formik.errors.headline} disabled={isLoading} helperText='e.g., Senior Developer @ Acme Inc.'/>
                         {/* Use TextareaField component */}
                        <TextareaField label="Bio" name="bio" rows={5} {...formik.getFieldProps('bio')} error={formik.touched.bio && formik.errors.bio} disabled={isLoading}/>
                        <InputField label="Location" name="location" placeholder="e.g., Cairo, Egypt" {...formik.getFieldProps('location')} error={formik.touched.location && formik.errors.location} disabled={isLoading}/>
                    </div>
                </div>

                 {/* Links Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Links</h3>
                    <div className="space-y-5"> {/* Increased spacing */}
                         <InputField type="url" label="Website URL" name="website_url" placeholder="https://..." {...formik.getFieldProps('website_url')} error={formik.touched.website_url && formik.errors.website_url} disabled={isLoading}/>
                         <InputField type="url" label="GitHub Profile URL" name="github_url" placeholder="https://github.com/..." {...formik.getFieldProps('github_url')} error={formik.touched.github_url && formik.errors.github_url} disabled={isLoading}/>
                         <InputField type="text" label="LeetCode Username" name="leetcode_username" placeholder="Username" {...formik.getFieldProps('leetcode_username')} error={formik.touched.leetcode_username && formik.errors.leetcode_username} disabled={isLoading}/>
                         <InputField type="url" label="LinkedIn Profile URL" name="linkedin_url" placeholder="https://linkedin.com/in/..." {...formik.getFieldProps('linkedin_url')} error={formik.touched.linkedin_url && formik.errors.linkedin_url} disabled={isLoading}/>
                         <InputField type="text" label="HackerRank Username" name="hackerrank_username" placeholder="Username" {...formik.getFieldProps('hackerrank_username')} error={formik.touched.hackerrank_username && formik.errors.hackerrank_username} disabled={isLoading}/>
                         {/* Add other links fields here similarly */}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-start mt-6 pt-4 border-t border-gray-200"> {/* Added border top */}
                    <button
                        type="submit"
                        className="inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 transition duration-150 ease-in-out"
                        disabled={isLoading || !formik.dirty || !formik.isValid} // Disable if loading, no changes, or invalid
                    >
                        {isLoading ? ( /* Simple Loading Spinner SVG */
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                                Saving...
                            </>
                         ) : ( 'Save Changes' )}
                    </button>
                     {/* Optional Cancel Button */}
                     {/* <button type="button" onClick={() => formik.resetForm()} className="..." disabled={isLoading}>Cancel</button> */}
                </div>

            </form>
        </div>
    );
};

export default EditProfile;