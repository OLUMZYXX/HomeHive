import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Typography';
import { useAPI } from '../../contexts/APIContext';
import Button from '../../components/Button';

export default function SignUpScreen() {
  const router = useRouter();
  const { register, isLoading } = useAPI();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters required';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    const success = await register(
      name.trim(),
      email.trim().toLowerCase(),
      password,
    );
    if (success) {
      Alert.alert('Welcome to HomeHive! 🎉', 'Your account has been created.', [
        { text: 'Let\'s Go!', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Registration Failed', 'This email may already be in use. Try signing in instead.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>HomeHive</Text>
          <Text style={styles.tagline}>Join thousands of happy guests</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create account</Text>
          <Text style={styles.cardSubtitle}>Start finding your perfect stay</Text>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
              autoComplete="name"
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.passwordWrapper, errors.password && styles.inputError]}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat your password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Password strength indicator */}
          {password.length > 0 && (
            <View style={styles.strengthRow}>
              <View style={styles.strengthBars}>
                {[1, 2, 3, 4].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthBar,
                      password.length >= level * 3 && styles.strengthBarFilled,
                      password.length >= 9 && styles.strengthBarStrong,
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.strengthLabel}>
                {password.length < 6
                  ? 'Too short'
                  : password.length < 9
                  ? 'Fair'
                  : password.length < 12
                  ? 'Good'
                  : 'Strong'}
              </Text>
            </View>
          )}

          {/* Register */}
          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            size="lg"
            style={{ marginTop: 8 }}
          />

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/signin')}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By creating an account, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: 20, paddingTop: 32 },

  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: FontSizes['4xl'],
    color: Colors.primary[800],
  },
  tagline: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 6,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes['2xl'],
    color: Colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginBottom: 24,
  },

  fieldGroup: { marginBottom: 16 },
  label: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  inputError: { borderColor: Colors.red[500] },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  eyeIcon: { fontSize: 18 },
  error: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.red[500],
    marginTop: 4,
  },

  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    marginTop: -8,
  },
  strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral[200],
  },
  strengthBarFilled: { backgroundColor: Colors.amber[500] },
  strengthBarStrong: { backgroundColor: Colors.green[500] },
  strengthLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    width: 50,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.primary[800],
  },

  terms: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  termsLink: { color: Colors.primary[700] },
});
