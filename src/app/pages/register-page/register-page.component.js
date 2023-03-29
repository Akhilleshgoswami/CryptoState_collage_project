import React, { useContext, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './register-page.css';
import { PermMedia } from '@mui/icons-material';
import { CircularProgress, Grid, TextField } from '@mui/material';
import { Context } from '../../utils/context-provider';
import { storage } from '../../configs/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { GOVT_ADDR } from '../../utils/constants';
import { ethers } from 'ethers';
import Loader from '../../components/loader/Loder';

function Register() {
	const { contractInstance, address } = useContext(Context);
	const [price, setprice] = useState();
	const [city, setcity] = useState();
	const [etherAddress, setetherAddress] = useState();
	const [placeaddress, setplaceaddress] = useState();
	const [imageUrl, setImageUrl] = useState();
	const [forsell, setforsell] = useState(false);
	const [loding, setLoading] = useState(false);

	const uploadFile = async (e) => {
		setLoading(true);
		const file = e.target.files[0];
		var storageRef = ref(storage, `images/${file.name}`);
		uploadBytesResumable(storageRef, file, file).then(() => {
			getDownloadURL(storageRef).then(function (url) {
				setImageUrl(url);
				setLoading(false);
			});
		});
	};

	const createSell = async (e) => {
		setLoading(true);
		e.preventDefault();
		try {
			let listingPrice = await contractInstance.methods
				.getListingPrice()
				.call();

			const costprice = ethers.utils.parseEther(price);
			const transactionObject = {
				from: address,
				value: listingPrice,
			};
			setetherAddress(etherAddress.toString().toLowerCase());

			await contractInstance.methods
				.mintCryptoState(
					city,
					imageUrl,
					costprice,
					placeaddress,
					etherAddress,
					forsell
				)
				.send(transactionObject);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
		// setImageUrl(null)
		// setcity("")
		// setetherAddress("")
		// setforsell(false)
		// setplaceaddress("")

		// router.push("/properties");
	};

	if (address === GOVT_ADDR) {
		return (
			<section className="contact">
				<Typography gutterBottom variant="h3" align="center" color={'white'}>
					Crypto-State
				</Typography>
				<Grid margin={'10%'}>
					<Card
						style={{ maxWidth: 450, padding: '20px 5px', margin: '0 auto' }}
					>
						<CardContent>
							<Typography gutterBottom variant="h5">
								<div className="center12">
									<h1>
										<span>
											<img
												style={{
													width: 'inherit',
													borderRadius: '50%',
												}}
												className="ts"
												src="https://media.istockphoto.com/id/1032066158/vector/india-round-flag-vector-flat-icon.jpg?s=612x612&w=0&k=20&c=cZO8Tq3HkrD1AZ3tGXYCHBq1S4oO5hrqrRaxKua1P5k="
												alt=""
											/>
										</span>
										<span className="center">I</span>
										<span className="center">N</span>
										<span className="center">D</span>
										<span className="center">I</span>
										<span className="center">A</span>
									</h1>
								</div>
							</Typography>

							<form>
								<Grid container spacing={1}>
									<Grid xs={12} sm={6} item>
										<TextField
											placeholder="Enter City name"
											label="City"
											variant="outlined"
											fullWidth
											required
											value={city}
											onChange={(e) => setcity(e.target.value)}
										/>
									</Grid>
									<Grid xs={12} sm={6} item>
										<TextField
											type="number"
											placeholder="Enter price"
											value={price}
											onChange={(e) => setprice(e.target.value)}
											label="Price"
											variant="outlined"
											fullWidth
											required
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											value={etherAddress}
											onChange={(e) => setetherAddress(e.target.value)}
											placeholder="Enter Ethereum Address"
											label="owner Address"
											variant="outlined"
											fullWidth
											required
										/>
									</Grid>{' '}
									<Grid item xs={4}>
										<input
											type="checkbox"
											fullWidth
											required
											value={forsell}
											onChange={(e) => setforsell(!forsell)}
										/>
										Want to put you on sell.
									</Grid>
									<Grid item xs={12}>
										<label htmlFor="id" className="shareoptin">
											<PermMedia htmlColor="blue" className="Share__icon" />
											<span className="shareoptin__text">
												upload Property photo
											</span>
											<input
												style={{ display: 'none' }}
												type="file"
												id="id"
												accept=".png ,.jpeg,.jpg"
												onChange={uploadFile}
											/>
										</label>
									</Grid>
									<Grid item xs={0}>
										<Button onClick={(e) => setImageUrl('')}>
											{' '}
											reset Image{' '}
										</Button>
									</Grid>
									<Grid item xs={12}>
										<TextField
											placeholder="Enter place Address"
											label="Place Address"
											multiline
											rows={4}
											variant="outlined"
											fullWidth
											required
											value={placeaddress}
											onChange={(e) => setplaceaddress(e.target.value)}
										/>
									</Grid>
									<Grid item xs={12}>
										{loding ? (
											<Loader />
										) : (
											<Button
												disabled={
													imageUrl === undefined ||
													imageUrl === '' ||
													placeaddress === undefined ||
													placeaddress === '' ||
													city === undefined ||
													city === '' ||
													price === undefined ||
													price === '' ||
													etherAddress === undefined ||
													etherAddress === '' ||
													forsell === undefined ||
													forsell === '' ||
													address === undefined
												}
												type="submit"
												variant="contained"
												color="primary"
												fullWidth
												onClick={createSell}
											>
												Register
											</Button>
										)}
									</Grid>
								</Grid>
							</form>
						</CardContent>
					</Card>
				</Grid>
			</section>
		);
	}
	return (
		<div>
			<h1> you are not authorized to access ..</h1>
		</div>
	);
}

export default Register;
