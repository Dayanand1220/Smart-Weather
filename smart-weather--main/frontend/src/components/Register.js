import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsSun, BsMoon } from 'react-icons/bs';
import { register } from '../services/authService';
import './Auth.css';

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your elementary school?",
  "What is your favorite book?",
  "What was your childhood nickname?",
  "What is the name of your favorite teacher?",
  "What street did you grow up on?"
];

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: ''
  });
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.securityQuestion) {
      setError('Please select a security question');
      return;
    }

    if (!formData.securityAnswer.trim()) {
      setError('Please provide an answer to the security question');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.securityQuestion,
        formData.securityAnswer
      );
      navigate('/');
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
          <h2 className="text-center mb-4">Sign Up</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Security Question</Form.Label>
              <Form.Select
                name="securityQuestion"
                value={formData.securityQuestion}
                onChange={handleChange}
                required
              >
                <option value="">Select a security question</option>
                {SECURITY_QUESTIONS.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Security Answer</Form.Label>
              <Form.Control
                type="text"
                name="securityAnswer"
                placeholder="Enter your answer"
                value={formData.securityAnswer}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                This will be used to reset your password if you forget it.
              </Form.Text>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Form>

          <div className="text-center">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register;
