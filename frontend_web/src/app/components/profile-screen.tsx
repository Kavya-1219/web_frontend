import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Edit2, Save, X, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Activity, Heart, Shield, Camera } from "lucide-react";
import api, { endpoints, dispatchRefresh } from "../helpers/api";

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

    const handleRefresh = () => loadProfileData();
    window.addEventListener('refreshDashboard', handleRefresh);
    window.addEventListener('storage', handleRefresh);
    return () => {
      window.removeEventListener('refreshDashboard', handleRefresh);
      window.removeEventListener('storage', handleRefresh);
    };
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await api.get(endpoints.profile);
      const data = response.data;
      
      setProfilePicture(data.profilePictureUrl || data.profile_picture_url || null);
      setProfileData({
        email: data.email || "",
        name: data.name || data.full_name || "",
        age: data.age || "",
        gender: data.gender || "",
        height: data.height || "",
        weight: data.weight || "",
        heightUnit: data.height_unit || data.heightUnit || "cm",
        weightUnit: data.weight_unit || data.weightUnit || "kg",
        dietType: data.diet_type || data.dietType || "",
        allergies: data.allergies || [],
        dislikes: data.dislikes || [],
        activityLevel: data.activityLevel || data.activity_level || "",
        targetWeight: data.targetWeight || data.target_weight || "",
        healthConditions: data.healthConditions || data.health_conditions || [],
        diabetesType: data.diabetesType || data.diabetes_type || "",
        bpReading: { 
          systolic: data.systolic || data.bp_systolic || "", 
          diastolic: data.diastolic || data.bp_diastolic || "" 
        },
        cholesterolLevel: data.cholesterolLevel || data.cholesterol_level || "",
        allergicFoods: data.foodAllergies || data.food_allergies || [],
        thyroidType: data.thyroidCondition || data.thyroid_condition || ""
      });
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Local Preview & LocalStorage
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const email = user.email || user.username || 'guest';
        localStorage.setItem(`profilePicture_${email}`, base64String);
        setProfilePicture(base64String);
      };
      reader.readAsDataURL(file);

      // 2. Backend Upload
      try {
        const formData = new FormData();
        formData.append('profile_picture', file);
        await api.post(endpoints.profilePicture, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error("Profile picture upload failed:", error);
      }

      dispatchRefresh();
    }
  };

  const handleSaveProfile = async () => {
    try {
      const sanitizeNumber = (val: any) => {
        if (val === "" || val === null || val === undefined) return null;
        const parsed = parseFloat(val);
        return isNaN(parsed) ? null : parsed;
      };
      
      const payload = {
        name: profileData.name,
        age: sanitizeNumber(profileData.age),
        gender: profileData.gender,
        height: sanitizeNumber(profileData.height),
        weight: sanitizeNumber(profileData.weight),
        diet_type: profileData.dietType,
        allergies: profileData.allergies,
        dislikes: profileData.dislikes,
        activityLevel: profileData.activityLevel,
        targetWeight: sanitizeNumber(profileData.targetWeight),
        healthConditions: profileData.healthConditions,
        diabetesType: profileData.diabetesType,
        systolic: sanitizeNumber(profileData.bpReading.systolic),
        diastolic: sanitizeNumber(profileData.bpReading.diastolic),
        cholesterolLevel: sanitizeNumber(profileData.cholesterolLevel),
        foodAllergies: profileData.allergicFoods,
        thyroidCondition: profileData.thyroidType,
      };

      await api.patch(endpoints.profile, payload);
      
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email || user.username || 'guest';
      const personalDetails = JSON.parse(localStorage.getItem(`personalDetails_${email}`) || '{}');
      personalDetails.name = payload.name;
      personalDetails.age = payload.age;
      localStorage.setItem(`personalDetails_${email}`, JSON.stringify(personalDetails));
      
      setIsEditing(false);
      dispatchRefresh();
    } catch (err) {
      console.error("Error saving profile:", err);
      setPasswordError("Failed to save profile changes.");
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    try {
      await api.post(endpoints.changePassword, {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordChange(false);
      alert("Password changed successfully!");
    } catch (err: any) {
      console.error("Error changing password:", err);
      setPasswordError(err.response?.data?.oldPassword?.[0] || err.response?.data?.error || "Failed to change password.");
    }
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
          <div className="relative group">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-white">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-green-600" />
              )}
            </div>
            
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition shadow-lg border-2 border-white">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 -mt-16 space-y-4 overflow-y-auto">
        {/* Email (Non-editable) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Email</h3>
          <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.email}</p>
        </div>

        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">Personal Information</h2>
          
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
              />
            ) : (
              <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.name || "N/A"}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
                />
              ) : (
                <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.age} years</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Gender</label>
              {isEditing ? (
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.gender || "N/A"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Body Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">Body Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Height</label>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={profileData.height}
                    onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
                  />
                  <span className="text-sm text-gray-400">{profileData.heightUnit}</span>
                </div>
              ) : (
                <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.height} {profileData.heightUnit}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Weight</label>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={profileData.weight}
                    onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
                  />
                  <span className="text-sm text-gray-400">{profileData.weightUnit}</span>
                </div>
              ) : (
                <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.weight} {profileData.weightUnit}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Target Weight</label>
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={profileData.targetWeight}
                  onChange={(e) => setProfileData({...profileData, targetWeight: e.target.value})}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
                />
                <span className="text-sm text-gray-400">{profileData.weightUnit}</span>
              </div>
            ) : (
              <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.targetWeight || "0"} {profileData.weightUnit}</p>
            )}
          </div>
        </div>

        {/* Food Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">Food Preferences</h2>
          
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Diet Type</label>
            {isEditing ? (
              <select
                value={profileData.dietType}
                onChange={(e) => setProfileData({...profileData, dietType: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Eggetarian">Eggetarian</option>
              </select>
            ) : (
              <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.dietType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Activity Level</label>
            <p className="text-base text-gray-800 dark:text-white font-semibold capitalize">{profileData.activityLevel.replace('-', ' ')}</p>
          </div>
        </div>

        {/* Health Conditions */}
        {profileData.healthConditions.length > 0 && profileData.healthConditions[0] !== 'none' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">Health Conditions</h2>
            
            <div className="flex flex-wrap gap-2">
              {profileData.healthConditions.map(condition => (
                <span key={condition} className="px-3 py-1 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-full text-sm font-medium capitalize border border-red-100 dark:border-red-900">
                  {condition.replace('-', ' ')}
                </span>
              ))}
            </div>

            {profileData.diabetesType && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Diabetes Status</label>
                <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.diabetesType}</p>
              </div>
            )}

            {profileData.bpReading.systolic && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Blood Pressure</label>
                <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.bpReading.systolic}/{profileData.bpReading.diastolic} mmHg</p>
              </div>
            )}

            {profileData.cholesterolLevel && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Cholesterol Level</label>
                <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.cholesterolLevel} mg/dL</p>
              </div>
            )}

            {profileData.thyroidType && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Thyroid Condition</label>
                <p className="text-base text-gray-800 dark:text-white font-semibold">{profileData.thyroidType}</p>
              </div>
            )}

            {profileData.allergicFoods.length > 0 && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Food Allergies</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.allergicFoods.map(food => (
                    <span key={food} className="px-3 py-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium border border-amber-100 dark:border-amber-900">
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
              className="w-full flex items-center justify-between py-3 text-green-600 hover:text-green-700 transition font-semibold"
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </div>
              <Edit2 className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Change Password</h3>
                <button onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordError("");
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}>
                  <X className="w-5 h-5 text-gray-400 hover:text-red-500 transition" />
                </button>
              </div>

              {passwordError && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium">{passwordError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
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
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Min 8 chars, 1 special char</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg focus:border-green-500 focus:outline-none dark:text-white"
                />
              </div>

              <button
                onClick={handlePasswordChange}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                Update Password
              </button>
            </div>
          )}
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => {
                loadProfileData();
                setIsEditing(false);
              }}
              className="flex-1 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
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