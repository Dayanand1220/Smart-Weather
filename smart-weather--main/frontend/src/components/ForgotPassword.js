import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsSun, BsMoon } from 'react-icons/bs';
import { getSecurityQuestion, resetPassword } from '../services/authService';
import './Auth.css';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: security question
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  // Apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const question = await getSecurityQuestion(email);
      setSecurityQuestion(question);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, securityAnswer, newPassword);
      alert('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-container">
      {/* Floating Weather Emojis */}
      <div className="weather-emoji weather-emoji-1">☀️</div>
      <div className="weather-emoji weather-emoji-2">⛅</div>
      <div className="weather-emoji weather-emoji-3">🌧️</div>
      <div className="weather-emoji weather-emoji-4">⛈️</div>
      <div className="weather-emoji weather-emoji-5">🌈</div>
      <div className="weather-emoji weather-emoji-6">❄️</div>
      <div className="weather-emoji weather-emoji-7">🌪️</div>
      <div className="weather-emoji weather-emoji-8">🌤️</div>
      
      <Button 
        variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
        onClick={toggleTheme}
        className="theme-toggle-auth"
      >
        {theme === 'light' ? (
          <>
            <BsMoon size={18} className="me-2" />
            Dark
          </>
        ) : (
          <>
            <BsSun size={18} className="me-2" />
            Light
          </>
        )}
      </Button>
      
      <Card className="auth-card">
        <Card.Body>
          <div className="auth-brand mb-4">
            <div className="brand-icon-large">🌤️</div>
            <h1 className="brand-name">WeatherWise</h1>
            <p className="brand-tagline">Smart Weather, Smarter Decisions</p>
          </div>
          <h2 className="text-center mb-4">Reset Password</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {step === 1 ? (
            <Form onSubmit={handleEmailSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  We'll ask you a security question to verify your identity.
                </Form.Text>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Checking...' : 'Continue'}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleResetSubmit}>
              <Alert variant="info">
                <strong>Security Question:</strong>
                <div className="mt-2">{securityQuestion}</div>
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>Your Answer</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <Button 
                variant="link" 
                className="w-100"
                onClick={() => setStep(1)}
              >
                Back to Email
              </Button>
            </Form>
          )}

          <div className="text-center mt-3">
            <Link to="/login">Back to Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ForgotPassword;
