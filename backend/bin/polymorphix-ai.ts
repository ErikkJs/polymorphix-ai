#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {PolymorphixAiStack} from '../lib/polymorphix-ai-stack';

const app = new cdk.App();
const props = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT as string,
    region: process.env.CDK_DEFAULT_REGION as string,
  },
  OPENAI_ORGANIZATION: process.env.OPENAI_ORGANIZATION as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
};
new PolymorphixAiStack(app, 'PolymorphixAiStack', props);
