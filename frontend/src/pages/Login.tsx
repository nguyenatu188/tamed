import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { useState } from "react";

const Login = () => {
	const [ inputs, setInputs ] = useState({
		username: "",
		password: "",
	})

const { loading, login} = useLogin()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		login(inputs.username, inputs.password)
	}
	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold mb-5 text-center text-white'>
					Login
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className='label p-2 '>
							<span className='label-text'>Username</span>
						</label>
						<input type='text' placeholder='Enter username'
						className='w-full input input-bordered h-10'
						value={inputs.username}
						onChange={(e) => setInputs({...inputs, username: e.target.value})}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={inputs.password}
							onChange={(e) => setInputs({...inputs, password: e.target.value})}
						/>
					</div>
					<Link
						to='/register'
						className='w-full text-right text-md hover:underline text-white hover:text-blue-300 my-5 inline-block'
					>
						{"Don't"} have an account?
					</Link>

					<div>
						<button className='btn btn-block btn-sm mt-2' disabled={loading}>
							{loading ? "Loading..." : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;
