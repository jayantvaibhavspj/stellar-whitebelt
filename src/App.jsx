import { useState, useEffect } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import {
  isConnected,
  requestAccess,
  getAddress,
  signTransaction,
} from '@stellar/freighter-api';
import './App.css';

const App = () => {
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState('0.0000000');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  const TESTNET_URL = 'https://horizon-testnet.stellar.org';
  const TESTNET_PASSPHRASE = StellarSdk.Networks.TESTNET;

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const connected = await isConnected();
      if (!connected) {
        setError('Freighter wallet not detected. Please install it from freighter.app');
        return;
      }

      await requestAccess();

      const addressObj = await getAddress();
      const pubKey = addressObj.address;

      setPublicKey(pubKey);
      await fetchBalance(pubKey);
      setSuccess('Wallet connected successfully!');
    } catch (err) {
      setError('Connection failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (address) => {
    try {
      const server = new StellarSdk.Horizon.Server(TESTNET_URL);
      const account = await server.accounts().accountId(address).call();
      const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
      setBalance(xlmBalance ? xlmBalance.balance : '0.0000000');
    } catch (err) {
      console.error('Balance fetch error:', err.message);
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    setBalance('0.0000000');
    setTxHash(null);
    setRecipientAddress('');
    setSendAmount('');
    setSuccess(null);
    setError(null);
  };

  const sendXLM = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    setSuccess(null);
    setTxHash(null);

    try {
      if (!recipientAddress.trim()) {
        setError('Please enter a recipient address');
        return;
      }
      if (!sendAmount || parseFloat(sendAmount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      const server = new StellarSdk.Horizon.Server(TESTNET_URL);
      const sourceAccount = await server.loadAccount(publicKey);

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: TESTNET_PASSPHRASE,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: recipientAddress,
            asset: StellarSdk.Asset.native(),
            amount: sendAmount.toString(),
          })
        )
        .setTimeout(180)
        .build();

      const xdrString = transaction.toEnvelope().toXDR('base64');

      const signResult = await signTransaction(xdrString, {
        networkPassphrase: TESTNET_PASSPHRASE,
      });

      const signedXDR = signResult.signedTxXdr;

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXDR, TESTNET_PASSPHRASE);
      const response = await server.submitTransaction(signedTx);

      setSuccess('Transaction successful!');
      setTxHash(response.hash);
      setRecipientAddress('');
      setSendAmount('');
      await fetchBalance(publicKey);
    } catch (err) {
      const code = err?.response?.data?.extras?.result_codes?.operations?.[0];
      setError('Transaction failed: ' + (code || err.message));
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      const interval = setInterval(() => fetchBalance(publicKey), 10000);
      return () => clearInterval(interval);
    }
  }, [publicKey]);

  return (
    <div className="container">
      <header className="header">
        <h1>Stellar dApp - White Belt</h1>
        <p>Send XLM on Testnet</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="card">
        <h2>Wallet Connection</h2>
        {!publicKey ? (
          <button onClick={connectWallet} disabled={loading} className="btn btn-primary">
            {loading ? 'Connecting...' : 'Connect Freighter Wallet'}
          </button>
        ) : (
          <div className="wallet-info">
            <div className="info-box">
              <label>Connected Address:</label>
              <code className="address">{publicKey}</code>
            </div>
            <div className="info-box">
              <label>XLM Balance:</label>
              <h3 className="balance">{parseFloat(balance).toFixed(7)} XLM</h3>
            </div>
            <button onClick={disconnectWallet} className="btn btn-secondary">
              Disconnect Wallet
            </button>
          </div>
        )}
      </section>

      {publicKey && (
        <section className="card">
          <h2>Send XLM</h2>
          <form onSubmit={sendXLM} className="form">
            <div className="form-group">
              <label>Recipient Address (Public Key)</label>
              <input
                type="text"
                placeholder="G..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                disabled={isSending}
              />
            </div>
            <div className="form-group">
              <label>Amount (XLM)</label>
              <input
                type="number"
                placeholder="0.00"
                step="0.0000001"
                min="0"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                disabled={isSending}
              />
            </div>
            <button
              type="submit"
              disabled={isSending || !recipientAddress || !sendAmount}
              className="btn btn-success"
            >
              {isSending ? 'Sending...' : 'Send XLM'}
            </button>
          </form>

          {txHash && (
            <div className="tx-result">
              <h3>Transaction Confirmed!</h3>
              <p className="tx-hash">
                <strong>Hash:</strong> <code>{txHash}</code>
              </p>
              <a
                href={'https://stellar.expert/explorer/testnet/tx/' + txHash}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-info"
              >
                View on Stellar Expert
              </a>
            </div>
          )}
        </section>
      )}

      {publicKey && (
        <section className="card">
          <h2>Need More Testnet XLM?</h2>
          <p>Use the official Stellar Testnet Faucet to get free XLM</p>
          <a
            href="https://laboratory.stellar.org/#account-creator"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-info"
          >
            Get Testnet XLM
          </a>
        </section>
      )}

      <footer className="footer">
        <p>Built for Stellar White Belt Challenge</p>
      </footer>
    </div>
  );
};

export default App;
