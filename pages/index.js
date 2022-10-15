import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConnect, useSigner } from 'wagmi';
import 'react-circular-progressbar/dist/styles.css';
import { Network, Alchemy } from 'alchemy-sdk';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

const Home = () => {
  const [step, setStep] = useState('MAIN');
  const { isConnected } = useConnect();
  const { data: signer, isError, isLoading } = useSigner();
  const alchemySettings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
    contractAddresses: ['0xe707a98108C31C77dDee267fDe07EFC8A8Bf86cc'],
  };
  const alchemy = new Alchemy(alchemySettings);

  const [formData, setFormData] = useState({});

  const handleChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleCheck = () => {
    alchemy.nft.getNftsForOwner(signer._address).then(nfts => {
      console.log(nfts);
      if (nfts.totalCount != 0) {
        setStep('FORM');
      } else {
        toast.error('You should hold an nft to claim the product!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    });
  };

  const claim = () => {
    const { name, phone, email, address, zip, city, country } = formData;
    if (name && phone && email && address && zip && city && country) {
      fetch(`/api/book?address=${signer._address}`, {
        method: 'POST',
        body: JSON.stringify({ ...formData }),
      })
        .then(async json => {
          const data = await json.json();
          console.log(data);
          if (data.success && data.max) {
            toast.error('We have reached the maximum 1000 form submissions.', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          } else if (data.success && data.isThere) {
            toast.success('already submited', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          } else if (data.success && !data.isThere && !data.max) {
            fetch(
              `/api/mail?email=${email}&text=<p>name:${name}</p><p>address:${address}</p><p>phone:${phone}</p><p>zip:${zip}</p><p>city:${city}</p><p>country:${country}`
            );
            toast.success(
              'Your shipping address is well submitted, You’ll receive the delivery soon.',
              {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              }
            );
          } else {
            toast.error('Error occured', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      toast.error('Compelete the missing field/s', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <img src="background.png" alt="" className="bg" />
      <div className="page">
        <div className="container">
          {step === 'MAIN' && (
            <>
              <div className="connect__btn">
                <ConnectButton />
              </div>

              <div className="avatar">
                <img src="/nft.png" alt="" className="avatar__image" />
              </div>

              <h1 className="card__title">Claim your exclusive VIP gift</h1>

              <p className="card__descr" style={{ textAlign: 'center' }}>
                Claim your exclusive VIP gift from our artist Greg Wray for
                being among the first 1,000 wallets to mint a Peculiar Pug!
              </p>
              <p
                className="card__descr"
                style={{
                  marginTop: '10px',
                  textAlign: 'center',
                  marginBottom: '50px',
                }}
              >
                Fill out the shipping form to receive your autographed 5x7 print
                of Sonic the Hedgehog signed by the original artist Greg Wray!
              </p>

              <div className="card__buttons__container">
                {isConnected && (
                  <button
                    style={{
                      marginTop: 24,
                      padding: '30px 100px',
                      cursor: 'pointer',
                    }}
                    className="button"
                    onClick={() => {
                      handleCheck();
                    }}
                  >
                    Claim your exclusive
                  </button>
                )}
              </div>
            </>
          )}
          {step === 'FORM' && (
            <>
              <div className="connect__btn">
                <ConnectButton />
              </div>

              <form className="form">
                <div className="field">
                  <label htmlFor="name" className="label">
                    Full name
                  </label>
                  <input
                    className="input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={e => {
                      handleChange(e, 'name');
                    }}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="phone" className="label">
                    Phone number
                  </label>
                  <input
                    className="input"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={e => {
                      handleChange(e, 'phone');
                    }}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <input
                    className="input"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={e => {
                      handleChange(e, 'email');
                    }}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="address" className="label">
                    Address
                  </label>
                  <input
                    className="input"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={e => {
                      handleChange(e, 'address');
                    }}
                    required
                    placeholder="apt, suite, bldg"
                  />
                </div>
                <div className="field">
                  <label htmlFor="zip" className="label">
                    Zip Code
                  </label>
                  <input
                    className="input"
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={e => {
                      handleChange(e, 'zip');
                    }}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="city" className="label">
                    City
                  </label>
                  <input
                    className="input"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={e => {
                      handleChange(e, 'city');
                    }}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="country" className="label">
                    Country
                  </label>
                  <input
                    className="input"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={e => {
                      handleChange(e, 'country');
                    }}
                    required
                  />
                </div>
              </form>

              <div className="card__buttons__container">
                {isConnected && (
                  <button
                    style={{
                      marginTop: '44px',
                      padding: '30px 100px',
                      cursor: 'pointer',
                    }}
                    className="button"
                    onClick={() => {
                      claim();
                    }}
                  >
                    Claim Now
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
