import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import {LambdaIntegration} from 'aws-cdk-lib/aws-apigateway';

export interface PolymorphixAiStackProps extends cdk.StackProps {
  env: {
    account: string;
    region: string;
  };
  OPENAI_ORGANIZATION: string;
  OPENAI_API_KEY: string;
}
export class PolymorphixAiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: PolymorphixAiStackProps) {
    super(scope, id, props);

    const polymorphixLambda = new NodejsFunction(this, 'PolymorphixLambda', {
      handler: 'POST',
      entry: './src/lambda/polymorphix.ts',
      runtime: Runtime.NODEJS_18_X,
      environment: {
        OPENAI_ORGANIZATION: props?.OPENAI_ORGANIZATION as string,
        OPENAI_API_KEY: props?.OPENAI_API_KEY as string,
      },
    });

    const api = new apigateway.RestApi(this, 'PolymorphixApi', {
      restApiName: 'Polymorphix API',
      description: 'API for handling voice to text to voice processing.',
    });

    const polymorphixResource = api.root.addResource('polymorphix');
    polymorphixResource.addMethod('POST', new LambdaIntegration(polymorphixLambda, {proxy: true}), {
      apiKeyRequired: false,
    });
  }
}
