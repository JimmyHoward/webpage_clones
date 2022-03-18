import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import { Typography, Avatar, Button, Paper, Grid, Container } from '@material-ui/core';
import Icon from './icon';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { signIn, signUp } from '../../actions/auth';

const initialState = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	confirmPassword: ''
};

const Auth = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);
	const [formData, setFormData] = useState(initialState);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isSignUp) {
			dispatch(signUp(formData, navigate));
		} else {
			dispatch(signIn(formData, navigate));
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

	const switchMode = () => {
		setIsSignUp((prevIsSignUp) => !prevIsSignUp);
		setShowPassword(false);
	};

	const googleSuccess = async (res) => {
		//reason for ?. is to avoid throwing error when res is inaccessible (undefined)
		const result = res?.profileObj;
		const token = res?.tokenId;

		try {
			dispatch({ type: 'AUTH', data: { result, token } });
			navigate('/');
		} catch (err) {
			console.log(err);
		}
	};

	const googleFailure = (err) => {
		console.log(err);
		console.log('Google Sign In was unsuccessful, please try again later');
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper className={classes.paper} elevation={3}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						{isSignUp && (
							<>
								<Input
									name="firstName"
									label="First Name"
									handleChange={handleChange}
									autoFocus
									half
								/>
								<Input
									name="lastName"
									label="Last Name"
									handleChange={handleChange}
									half
								/>
							</>
						)}
						<Input
							name="email"
							label="Email Address"
							handleChange={handleChange}
							type="email"
						/>
						<Input
							name="password"
							label="Password"
							handleChange={handleChange}
							handleShowPassword={handleShowPassword}
							type={showPassword ? 'text' : 'password'}
						/>
						{isSignUp && (
							<Input
								name="confirmPassword"
								label="Repeat Password"
								handleChange={handleChange}
								type="password"
							/>
						)}
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						{isSignUp ? 'Sign Up' : 'Sign In'}
					</Button>
					<GoogleLogin
						clientId="590781894030-od5kc5mo9rkc29rdjatepiji7437h38j.apps.googleusercontent.com"
						render={(renderProps) => (
							<Button
								className="classes.googleButton"
								fullWidth
								onClick={renderProps.onClick}
								color="primary"
								disabled={renderProps.disable}
								startIcon={<Icon />}
								variant="contained"
							>
								Google Sign In
							</Button>
						)}
						onSuccess={googleSuccess}
						onFailure={googleFailure}
						cookiePolicy="single_host_origin"
					/>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Button onClick={switchMode}>
								{isSignUp
									? 'Already have an account? Sign in'
									: "Don't have an account? Sign up"}
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
		</Container>
	);
};

export default Auth;
