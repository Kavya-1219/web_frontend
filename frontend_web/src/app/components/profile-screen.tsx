import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Edit2, Save, X, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [profileData, setProfileData] = useState({
    email: "",
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    heightUnit: "cm",
    weightUnit: "kg",
    dietType: "",
    allergies: [] as string[],
    dislikes: [] as string[],
    activityLevel: "",
    targetWeight: "",
    healthConditions: [] as string[],
    diabetesType: "",
    bpReading: { systolic: "", diastolic: "" },
    cholesterolLevel: "",
    allergicFoods: [] as string[],
    thyroidType: ""
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    const email = localStorage.getItem('currentUserEmail') || '';
    const personal = JSON.parse(localStorage.getItem('personalDetails') || '{}');
    const body = JSON.parse(localStorage.getItem('bodyDetails') || '{}');
    const food = JSON.parse(localStorage.getItem('foodPreferences') || '{}');
    const lifestyle = JSON.parse(localStorage.getItem('lifestyle') || '{}');
    const targetWeight = localStorage.getItem('targetWeight') || '';
    const conditions = JSON.parse(localStorage.getItem('healthConditions') || '[]');
    const conditionDetails = JSON.parse(localStorage.getItem('healthConditionDetails') || '{}');
    const savedPicture = localStorage.getItem(`profilePicture_${email}`);

    setProfilePicture(savedPicture);
    setProfileData({
      email,
      name: personal.name || '',
      age: personal.age || '',
      gender: personal.gender || '',
      height: body.height || '',
      weight: body.weight || '',
      heightUnit: body.heightUnit || 'cm',
      weightUnit: body.weightUnit || 'kg',
      dietType: food.dietType || '',
      allergies: food.allergies || [],
      dislikes: food.dislikes || [],
      activityLevel: lifestyle.activityLevel || '',
      targetWeight,
      healthConditions: conditions,
      diabetesType: conditionDetails.diabetesType || '',
      bpReading: conditionDetails.bpReading || { systolic: '', diastolic: '' },
      cholesterolLevel: conditionDetails.cholesterolLevel || '',
      allergicFoods: conditionDetails.allergicFoods || [],
      thyroidType: conditionDetails.thyroidType || ''
    });
  };

  const handleSaveProfile = () => {
    // Save updated data to localStorage
    localStorage.setItem('personalDetails', JSON.stringify({
      name: profileData.name,
      age: profileData.age,
      gender: profileData.gender
    }));

    localStorage.setItem('bodyDetails', JSON.stringify({
      height: profileData.height,
      weight: profileData.weight,
      heightUnit: profileData.heightUnit,
      weightUnit: profileData.weightUnit
    }));

    localStorage.setItem('foodPreferences', JSON.stringify({
      dietType: profileData.dietType,
      allergies: profileData.allergies,
      dislikes: profileData.dislikes
    }));

    localStorage.setItem('lifestyle', JSON.stringify({
      activityLevel: profileData.activityLevel
    }));

    if (profileData.targetWeight) {
      localStorage.setItem('targetWeight', profileData.targetWeight);
    }

    localStorage.setItem('healthConditions', JSON.stringify(profileData.healthConditions));
    
    localStorage.setItem('healthConditionDetails', JSON.stringify({
      diabetesType: profileData.diabetesType,
      bpReading: profileData.bpReading,
      cholesterolLevel: profileData.cholesterolLevel,
      allergicFoods: profileData.allergicFoods,
      thyroidType: profileData.thyroidType
    }));

    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    
    // Get registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === profileData.email);
    
    if (userIndex === -1) {
      setPasswordError("User not found");
      return;
    }

    // Check current password
    if (users[userIndex].password !== passwordData.currentPassword) {
      setPasswordError("Current password is incorrect");
      return;
    }

    // Validate new password
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(passwordData.newPassword)) {
      setPasswordError("New password must include at least 1 special character");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    // Update password
    users[userIndex].password = passwordData.newPassword;
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    // Reset form
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordChange(false);
    alert("Password changed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 pt-8 pb-24 px-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-xl transition"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-2xl text-white font-semibold">Profile</h1>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
            >
              <Edit2 className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg relative cursor-pointer">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-green-600" />
            )}
            <div className="absolute bottom-0 right-0 p-1.5 bg-green-500 rounded-full border-2 border-white">
                <Edit2 className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 -mt-16 space-y-4">
        {/* Email (Non-editable) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Email</h3>
          <p className="text-base text-gray-800 dark:text-white">{profileData.email}</p>
        </div>

        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">Personal Information</h2>
          
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
              />
            ) : (
              <p className="text-base text-gray-800 dark:text-white">{profileData.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
                />
              ) : (
                <p className="text-base text-gray-800 dark:text-white">{profileData.age} years</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Gender</label>
              {isEditing ? (
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-base text-gray-800 dark:text-white">{profileData.gender}</p>
              )}
            </div>
          </div>
        </div>

        {/* Body Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">Body Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Height</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.height}
                  onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
                />
              ) : (
                <p className="text-base text-gray-800 dark:text-white">{profileData.height} {profileData.heightUnit}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Weight</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
                />
              ) : (
                <p className="text-base text-gray-800 dark:text-white">{profileData.weight} {profileData.weightUnit}</p>
              )}
            </div>
          </div>

          {profileData.targetWeight && (
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Target Weight</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.targetWeight}
                  onChange={(e) => setProfileData({...profileData, targetWeight: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
                />
              ) : (
                <p className="text-base text-gray-800 dark:text-white">{profileData.targetWeight} {profileData.weightUnit}</p>
              )}
            </div>
          )}
        </div>

        {/* Food Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">Food Preferences</h2>
          
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Diet Type</label>
            {isEditing ? (
              <select
                value={profileData.dietType}
                onChange={(e) => setProfileData({...profileData, dietType: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Eggetarian">Eggetarian</option>
              </select>
            ) : (
              <p className="text-base text-gray-800 dark:text-white">{profileData.dietType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Activity Level</label>
            <p className="text-base text-gray-800 dark:text-white capitalize">{profileData.activityLevel.replace('-', ' ')}</p>
          </div>
        </div>

        {/* Health Conditions */}
        {profileData.healthConditions.length > 0 && profileData.healthConditions[0] !== 'none' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">Health Conditions</h2>
            
            <div className="flex flex-wrap gap-2">
              {profileData.healthConditions.map(condition => (
                <span key={condition} className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm capitalize border border-red-100 dark:border-red-800">
                  {condition.replace('-', ' ')}
                </span>
              ))}
            </div>

            {profileData.diabetesType && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Diabetes Type</label>
                <p className="text-base text-gray-800 dark:text-white">{profileData.diabetesType}</p>
              </div>
            )}

            {profileData.bpReading.systolic && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Blood Pressure</label>
                <p className="text-base text-gray-800 dark:text-white">{profileData.bpReading.systolic}/{profileData.bpReading.diastolic} mmHg</p>
              </div>
            )}

            {profileData.cholesterolLevel && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Cholesterol Level</label>
                <p className="text-base text-gray-800 dark:text-white">{profileData.cholesterolLevel} mg/dL</p>
              </div>
            )}

            {profileData.thyroidType && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Thyroid Condition</label>
                <p className="text-base text-gray-800 dark:text-white">{profileData.thyroidType}</p>
              </div>
            )}

            {profileData.allergicFoods.length > 0 && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Food Allergies</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.allergicFoods.map(food => (
                    <span key={food} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm border border-amber-100 dark:border-amber-800">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Password Change */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="w-full flex items-center justify-between py-3 text-blue-600 hover:text-blue-700 transition"
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span className="font-medium">Change Password</span>
              </div>
              <Edit2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Change Password</h3>
                <button onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordError("");
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {passwordError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{passwordError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">At least 8 characters with 1 special character</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handlePasswordChange}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition"
              >
                Update Password
              </button>
            </div>
          )}
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex space-x-3">
            <button
              onClick={() => {
                loadProfileData();
                setIsEditing(false);
              }}
              className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}