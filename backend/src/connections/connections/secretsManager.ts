import {GetSecretValueCommand, SecretsManagerClient} from '@aws-sdk/client-secrets-manager';


export const getCredentialsFromSecret = async <T>(secretId: string): Promise<T> => {
  // Create a new AWS Secrets Manager client
  const client = new SecretsManagerClient({region: 'us-west-2'});

  // Define the request parameters
  const params = {
    SecretId: secretId,
  };

  // Execute the request to retrieve the secret value
  const command = new GetSecretValueCommand(params);
  const response = await client.send(command);

  // Parse the secret value JSON and return the result
  return JSON.parse(response.SecretString ?? '{}') as T;
};
