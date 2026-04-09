import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Label } from '../../components/ui/Label.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';
import { Checkbox } from '../../components/ui/Checkbox.jsx';
import { ScrollArea } from '../../components/ui/Scroll-area.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Calendar,
  Flag,
  Upload,
  Camera,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Plus,
  X,
  Languages,
  Star,
  Shield,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { confetti } from '../../lib/confetti.js';

const NewUser = () => {
  const [formData, setFormData] = useState({
    signUp: { email: '', password: '', confirmPassword: '' },
    personalInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      idNumber: '',
      photo: null,
      dateOfBirth: '',
      nationality: '',
    },
    kyc: {
      idDocument: null,
      proofOfAddress: null,
      certifications: [],
    },
    meta: {
      hasAccount: null,
      accountConnected: false,
    },
    profile: {
      verified: false,
      languages: [],
      specialties: [],
      experience: '',
    },
    terms: {
      accepted: false,
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleUpdate = (step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    const stepData = formData[Object.keys(formData)[currentStep - 1]];

    switch (currentStep) {
      case 1:
        if (!stepData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stepData.email)) {
          newErrors.email = 'Valid email is required.';
        }
        if (!stepData.password || stepData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters.';
        }
        if (stepData.password !== stepData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match.';
        }
        break;
      case 2:
        if (!stepData.firstName.trim()) newErrors.firstName = 'First name is required.';
        if (!stepData.lastName.trim()) newErrors.lastName = 'Last name is required.';
        if (!stepData.phone.trim()) newErrors.phone = 'Phone number is required.';
        if (!stepData.address.trim()) newErrors.address = 'Address is required.';
        if (!stepData.idNumber.trim()) newErrors.idNumber = 'ID number is required.';
        if (!stepData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';
        if (!stepData.nationality.trim()) newErrors.nationality = 'Nationality is required.';
        if (!stepData.photo) newErrors.photo = 'Profile photo is required.';
        break;
      case 3:
        if (!stepData.idDocument) newErrors.idDocument = 'Government ID is required.';
        if (!stepData.proofOfAddress) newErrors.proofOfAddress = 'Proof of address is required.';
        break;
      case 4:
        if (formData.meta.hasAccount === null) {
          newErrors.meta = 'Please make a choice about your Meta account.';
        } else if (formData.meta.hasAccount === true && !formData.meta.accountConnected) {
          newErrors.meta = 'Please connect your Meta account.';
        }
        break;
      case 5:
        if (!stepData.verified) newErrors.verified = 'Please verify your profile.';
        break;
      case 6:
        if (!stepData.accepted) newErrors.accepted = 'You must accept the terms.';
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Registration Successful!');
      setCurrentStep(7);
    } catch (error) {
      alert('Registration Failed!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    'Sign Up',
    'Personal Info',
    'KYC Upload',
    'Meta Account',
    'Profile Verification',
    'T&C',
    'Complete',
  ];

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Dutch'
  ];

  const commonSpecialties = [
    'Historical Tours', 'Cultural Tours', 'Food & Wine', 'Adventure Tourism',
    'Nature & Wildlife', 'Architecture', 'Museums', 'Photography Tours',
    'Religious Sites', 'Shopping Tours', 'Nightlife', 'Family-Friendly'
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [hasReadConduct, setHasReadConduct] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (currentStep === 7) {
      confetti();
    }
  }, [currentStep]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpdate('personalInfo', { photo: file });
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const addTag = (type, tag) => {
    if (tag && !formData.profile[type].includes(tag)) {
      handleUpdate('profile', { [type]: [...formData.profile[type], tag] });
    }
  };

  const removeTag = (type, tag) => {
    handleUpdate('profile', {
      [type]: formData.profile[type].filter((item) => item !== tag),
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
              <p className="text-muted-foreground">Start your journey as a professional tourism guide</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.signUp.email}
                    onChange={(e) => handleUpdate('signUp', { email: e.target.value })}
                    className={cn('pl-10', errors.email && 'border-destructive')}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.signUp.password}
                    onChange={(e) => handleUpdate('signUp', { password: e.target.value })}
                    className={cn('pl-10 pr-10', errors.password && 'border-destructive')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.signUp.confirmPassword}
                    onChange={(e) => handleUpdate('signUp', { confirmPassword: e.target.value })}
                    className={cn('pl-10 pr-10', errors.confirmPassword && 'border-destructive')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
              </div>
              <Card className="bg-muted/50 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-2">Password Requirements:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className={cn('flex items-center gap-2', formData.signUp.password.length >= 8 ? 'text-success' : '')}>
                      <div className={cn('w-1.5 h-1.5 rounded-full', formData.signUp.password.length >= 8 ? 'bg-success' : 'bg-muted-foreground')} />
                      At least 8 characters long
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
              <p className="text-muted-foreground">Tell us about yourself to create your guide profile</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              <Card className="bg-muted/50 border-primary/20">
                <CardContent className="p-6">
                  <Label className="text-base font-medium mb-4 block">Profile Photo</Label>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {photoPreview ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden shadow-medium">
                          <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <Button type="button" variant="ocean" size="sm" className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Click the button to upload your photo</p>
                      <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB (JPG, PNG)</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </div>
                  {errors.photo && <p className="text-sm text-destructive mt-2 text-center">{errors.photo}</p>}
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="firstName" placeholder="Enter your first name" value={formData.personalInfo.firstName} onChange={(e) => handleUpdate('personalInfo', { firstName: e.target.value })} className={cn('pl-10', errors.firstName && 'border-destructive')} />
                  </div>
                  {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="lastName" placeholder="Enter your last name" value={formData.personalInfo.lastName} onChange={(e) => handleUpdate('personalInfo', { lastName: e.target.value })} className={cn('pl-10', errors.lastName && 'border-destructive')} />
                  </div>
                  {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={formData.personalInfo.phone} onChange={(e) => handleUpdate('personalInfo', { phone: e.target.value })} className={cn('pl-10', errors.phone && 'border-destructive')} />
                  </div>
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="dateOfBirth" type="date" value={formData.personalInfo.dateOfBirth} onChange={(e) => handleUpdate('personalInfo', { dateOfBirth: e.target.value })} className={cn('pl-10', errors.dateOfBirth && 'border-destructive')} />
                  </div>
                  {errors.dateOfBirth && <p className="text-sm text-destructive mt-1">{errors.dateOfBirth}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input id="idNumber" placeholder="Enter your ID number" value={formData.personalInfo.idNumber} onChange={(e) => handleUpdate('personalInfo', { idNumber: e.target.value })} className={errors.idNumber && 'border-destructive'} />
                  {errors.idNumber && <p className="text-sm text-destructive mt-1">{errors.idNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input id="nationality" placeholder="e.g., American, British, etc." value={formData.personalInfo.nationality} onChange={(e) => handleUpdate('personalInfo', { nationality: e.target.value })} className={cn('pl-10', errors.nationality && 'border-destructive')} />
                  </div>
                  {errors.nationality && <p className="text-sm text-destructive mt-1">{errors.nationality}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <Textarea id="address" placeholder="Enter your full address" value={formData.personalInfo.address} onChange={(e) => handleUpdate('personalInfo', { address: e.target.value })} className={cn('pl-10 min-h-[80px]', errors.address && 'border-destructive')} />
                </div>
                {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
              </div>
            </form>
          </div>
        );
      case 3:
        return (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 gradient-nature rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
              <p className="text-muted-foreground">Upload your documents to verify your identity and qualifications</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              <FileUploadArea
                label="Government Issued ID"
                description="Upload a clear photo of your passport, driver's license, or national ID card"
                acceptedTypes=".jpg,.jpeg,.png,.pdf"
                file={formData.kyc.idDocument}
                onFileSelect={(file) => handleUpdate('kyc', { idDocument: file })}
                onFileRemove={() => handleUpdate('kyc', { idDocument: null })}
                error={errors.idDocument}
                required
              />
              <FileUploadArea
                label="Proof of Address"
                description="Upload a recent utility bill, bank statement, or lease agreement (not older than 3 months)"
                acceptedTypes=".jpg,.jpeg,.png,.pdf"
                file={formData.kyc.proofOfAddress}
                onFileSelect={(file) => handleUpdate('kyc', { proofOfAddress: file })}
                onFileRemove={() => handleUpdate('kyc', { proofOfAddress: null })}
                error={errors.proofOfAddress}
                required
              />
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Professional Certifications</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload any tourism, hospitality, or language certifications (optional but recommended)
                  </p>
                </div>
                {formData.kyc.certifications.length > 0 && (
                  <div className="space-y-3">
                    {formData.kyc.certifications.map((file, index) => (
                      <Card key={index} className="border-accent/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-accent" />
                              <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeTag('certifications', index)} className="text-muted-foreground hover:text-destructive">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <FileUploadArea
                  label="Add Certification"
                  description="Tourism guide license, language certificates, first aid certification, etc."
                  acceptedTypes=".jpg,.jpeg,.png,.pdf"
                  file={null}
                  onFileSelect={(file) => handleUpdate('kyc', { certifications: [...formData.kyc.certifications, file] })}
                  onFileRemove={() => {}}
                />
              </div>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-2">Important Information</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• All documents must be clear and readable</li>
                        <li>• Your information will be kept secure and confidential</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        );
      case 4:
        return (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <ExternalLink className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Connect Meta Account</h2>
              <p className="text-muted-foreground">Connect your Meta account to access advanced tourism features</p>
            </div>
            <div className="space-y-6">
              {formData.meta.hasAccount === null && (
                <div className="text-center space-y-6">
                  <h3 className="text-lg font-semibold">Do you have a Meta account?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={cn('cursor-pointer border-2', formData.meta.hasAccount === true && 'border-primary')} onClick={() => handleUpdate('meta', { hasAccount: true })}>
                      <CardContent className="p-6 text-center">
                        <Check className="w-8 h-8 mx-auto mb-3 text-success" />
                        <h4 className="font-medium mb-2">Yes, I have an account</h4>
                      </CardContent>
                    </Card>
                    <Card className={cn('cursor-pointer border-2', formData.meta.hasAccount === false && 'border-primary')} onClick={() => handleUpdate('meta', { hasAccount: false })}>
                      <CardContent className="p-6 text-center">
                        <ExternalLink className="w-8 h-8 mx-auto mb-3 text-primary" />
                        <h4 className="font-medium mb-2">No, I need to create one</h4>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              {formData.meta.hasAccount === true && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Connect Your Meta Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!formData.meta.accountConnected ? (
                      <>
                        <Button variant="hero" size="lg" onClick={() => { setIsConnecting(true); setTimeout(() => { handleUpdate('meta', { accountConnected: true }); setIsConnecting(false); }, 2000); }} disabled={isConnecting} className="w-full">
                          {isConnecting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Connecting...</>) : (<>Connect Meta Account <ExternalLink className="w-4 h-4" /></>)}
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-8 h-8 text-success" />
                        </div>
                        <h4 className="font-semibold text-success mb-2">Successfully Connected!</h4>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              {formData.meta.hasAccount === false && (
                <Card className="border-secondary/20">
                  <CardContent className="p-4">
                    <p className="text-muted-foreground">You'll need to create a Meta account to proceed. Click below to visit Meta's website:</p>
                    <Button variant="sunset" size="lg" onClick={() => window.open('https://meta.com', '_blank')} className="w-full mt-4">
                      Visit Meta Website
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Profile Verification</h2>
              <p className="text-muted-foreground">Review your information and complete your guide profile</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      {photoPreview ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden shadow-medium">
                          <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                         <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{formData.personalInfo.firstName} {formData.personalInfo.lastName}</h3>
                        <p className="text-muted-foreground">{formData.personalInfo.nationality}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className={cn('transition-smooth', formData.profile.verified ? 'border-success/20 bg-success/5' : 'border-border')}>
                  <CardContent className="p-6">
                    {!formData.profile.verified ? (
                      <Button variant="hero" onClick={() => { setIsVerifying(true); setTimeout(() => { handleUpdate('profile', { verified: true }); setIsVerifying(false); }, 3000); }} disabled={isVerifying} className="w-full">
                        {isVerifying ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying Profile...</>) : (<>Verify Profile</>)}
                      </Button>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="w-8 h-8 text-success mx-auto mb-4" />
                        <h3 className="font-semibold text-success mb-2">Profile Verified!</h3>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Languages Spoken</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.profile.languages.map((lang, i) => (<Badge key={i} variant="secondary">{lang} <Button variant="ghost" size="sm" onClick={() => removeTag('languages', lang)} className="h-auto p-0 ml-2"><X className="w-3 h-3" /></Button></Badge>))}
                    </div>
                    <Input placeholder="Add a language..." value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag('languages', newLanguage); setNewLanguage(''); }}} />
                    <div className="flex flex-wrap gap-2">
                      {commonLanguages.filter((lang) => !formData.profile.languages.includes(lang)).slice(0, 6).map((lang) => (<Button key={lang} variant="ghost" size="sm" onClick={() => addTag('languages', lang)} className="h-7 text-xs">+ {lang}</Button>))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Tour Specialties</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.profile.specialties.map((spec, i) => (<Badge key={i} variant="secondary">{spec} <Button variant="ghost" size="sm" onClick={() => removeTag('specialties', spec)} className="h-auto p-0 ml-2"><X className="w-3 h-3" /></Button></Badge>))}
                    </div>
                    <Input placeholder="Add a specialty..." value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag('specialties', newSpecialty); setNewSpecialty(''); }}} />
                    <div className="flex flex-wrap gap-2">
                      {commonSpecialties.filter((spec) => !formData.profile.specialties.includes(spec)).slice(0, 6).map((spec) => (<Button key={spec} variant="ghost" size="sm" onClick={() => addTag('specialties', spec)} className="h-7 text-xs">+ {spec}</Button>))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Experience & Bio</CardTitle></CardHeader>
                  <CardContent>
                    <Textarea placeholder="Describe your experience..." value={formData.profile.experience} onChange={(e) => handleUpdate('profile', { experience: e.target.value })} className="min-h-[120px]" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Terms & Conditions</h2>
            </div>
            <div className="space-y-6">
              <Card><CardHeader><CardTitle>Terms of Service</CardTitle></CardHeader><CardContent><ScrollArea className="h-48 w-full rounded border p-4 bg-muted/30">...</ScrollArea><div className="flex items-center space-x-2 mt-4"><Checkbox id="terms-read" checked={hasReadTerms} onCheckedChange={(checked) => setHasReadTerms(checked)} /><label htmlFor="terms-read" className="text-sm">I have read...</label></div></CardContent></Card>
              <Card><CardHeader><CardTitle>Privacy Policy</CardTitle></CardHeader><CardContent><ScrollArea className="h-48 w-full rounded border p-4 bg-muted/30">...</ScrollArea><div className="flex items-center space-x-2 mt-4"><Checkbox id="privacy-read" checked={hasReadPrivacy} onCheckedChange={(checked) => setHasReadPrivacy(checked)} /><label htmlFor="privacy-read" className="text-sm">I have read...</label></div></CardContent></Card>
              <Card><CardHeader><CardTitle>Code of Conduct</CardTitle></CardHeader><CardContent><ScrollArea className="h-48 w-full rounded border p-4 bg-muted/30">...</ScrollArea><div className="flex items-center space-x-2 mt-4"><Checkbox id="conduct-read" checked={hasReadConduct} onCheckedChange={(checked) => setHasReadConduct(checked)} /><label htmlFor="conduct-read" className="text-sm">I have read...</label></div></CardContent></Card>
              <Card className={cn('border-2', hasReadTerms && hasReadPrivacy && hasReadConduct ? 'border-success' : 'border-primary/20')}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Final Agreement</h3>
                      <p className="text-muted-foreground">By checking this box, you acknowledge that you have read, understood, and agree to be bound by all the terms, conditions, and policies outlined above.</p>
                      <div className="flex items-center space-x-3 mt-4">
                        <Checkbox id="accept-all" checked={formData.terms.accepted} onCheckedChange={(checked) => handleUpdate('terms', { accepted: checked })} disabled={!hasReadTerms || !hasReadPrivacy || !hasReadConduct} />
                        <label htmlFor="accept-all" className={cn('text-base font-medium', (!hasReadTerms || !hasReadPrivacy || !hasReadConduct) && 'opacity-50')}>I accept all...</label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="mb-8">
              <div className="w-32 h-32 gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow animate-bounce-in">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4 gradient-hero bg-clip-text text-transparent">🎉 Congratulations!</h1>
              <h2 className="text-2xl font-semibold mb-3">Welcome to the Tourism Guide Community</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Your registration has been successfully completed!</p>
            </div>
            <Button variant="hero" size="lg" className="w-full group" onClick={() => window.location.href = '/dashboard'}>
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 py-12">
      <Card className="w-full max-w-5xl mx-auto shadow-large p-8">
        <CardContent>
          <div className="flex flex-col items-center justify-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Guide Registration</h1>
            <p className="text-muted-foreground">Complete the steps below to become a certified tourism guide.</p>
          </div>
          <div className="flex justify-between items-start w-full max-w-2xl mx-auto mb-8">
            {steps.slice(0, 6).map((label, index) => {
              const step = index + 1;
              const isCompleted = step < currentStep;
              const isActive = step === currentStep;
              return (
                <div key={label} className="flex-1 text-center relative">
                  <div className={cn("relative z-10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-smooth", isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground", isActive && "gradient-hero text-white shadow-glow")}>
                    {isCompleted ? <CheckCircle className="w-6 h-6 text-white" /> : <span className="font-semibold">{step}</span>}
                  </div>
                  <div className="text-xs font-medium mt-2 max-w-[120px] mx-auto text-muted-foreground">{label}</div>
                  {index < 5 && <div className={cn("absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 -translate-y-1/2 transition-smooth", isCompleted ? "bg-primary" : "bg-border")} />}
                </div>
              );
            })}
          </div>
          <div className="mt-8">
            {renderStep()}
          </div>
          {currentStep < 7 && (
            <div className="flex justify-between pt-6 mt-8">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious} className="group">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-smooth" />
                  Previous
                </Button>
              )}
              {currentStep < 6 && (
                <Button type="button" variant="hero" onClick={handleNext} className="group ml-auto">
                  Continue
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                </Button>
              )}
              {currentStep === 6 && (
                <Button type="button" variant="hero" onClick={handleSubmit} className="group ml-auto">
                  Complete Registration
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const FileUploadArea = ({ label, description, acceptedTypes, file, onFileSelect, onFileRemove, error, required = false }) => {
  const fileInputRef = useRef(null);
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return (
    <Card className={cn('transition-smooth', error ? 'border-destructive' : file ? 'border-success' : 'border-border')}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {label}
          {required && <span className="text-destructive">*</span>}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {file ? (
          <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onFileRemove} className="text-muted-foreground hover:text-destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div onClick={() => fileInputRef.current?.click()} className={cn('border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-smooth hover:border-primary/50 hover:bg-primary/5', error && 'border-destructive/50 bg-destructive/5')}>
            <Upload className={cn('w-8 h-8 mx-auto mb-3', error ? 'text-destructive' : 'text-muted-foreground')} />
            <p className="font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground"> {acceptedTypes} (Max 10MB) </p>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept={acceptedTypes} onChange={handleFileSelect} className="hidden" />
        {error && (<div className="flex items-center gap-2 mt-3 text-sm text-destructive"><AlertCircle className="w-4 h-4" />{error}</div>)}
      </CardContent>
    </Card>
  );
};
export default NewUser;