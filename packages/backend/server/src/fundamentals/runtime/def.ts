import { Injectable, Provider } from '@nestjs/common';

import { Config } from '../config';

export interface RuntimeConfigs {
  // auth
  'auth/allowRegistration': boolean;
  'auth/allowEmailLogin': boolean;
  'auth/allowOAuthLogin': boolean;
  'auth/requireEmailVerification': boolean;

  // feature flags
  'feature/copilot': boolean;
}

export type RuntimeConfigKey = keyof RuntimeConfigs;
export type RuntimeConfig<T extends RuntimeConfigKey> = RuntimeConfigs[T];
type Scope<T extends string> = T extends `${infer S}/${infer _}` ? S : never;
export type RuntimeConfigScope = Scope<RuntimeConfigKey>;
export type RuntimeConfigByScope<T extends RuntimeConfigScope> = {
  [K in RuntimeConfigKey as Scope<K> extends T ? K : never]: RuntimeConfig<K>;
};

@Injectable()
export class DefaultRuntimeConfigs implements RuntimeConfigs {
  'auth/allowRegistration' = true;
  'auth/allowEmailLogin' = true;
  'auth/allowOAuthLogin' = true;
  'auth/requireEmailVerification' = true;
  'feature/copilot' = true;
}

export class SelfHostDefaultRuntimeConfigs extends DefaultRuntimeConfigs {
  override 'auth/requireEmailVerification' = false;
  override 'feature/copilot' = false;
}

export const DefaultRuntimeConfigsProvider: Provider = {
  provide: DefaultRuntimeConfigs,
  useFactory: (config: Config) => {
    if (config.isSelfhosted) {
      return new SelfHostDefaultRuntimeConfigs();
    } else {
      return new DefaultRuntimeConfigs();
    }
  },
  inject: [Config],
};
