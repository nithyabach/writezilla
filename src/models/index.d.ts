import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerStory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Story, 'id'>;
  };
  readonly id: string;
  readonly title: string;
  readonly color: string;
  readonly userId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyStory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Story, 'id'>;
  };
  readonly id: string;
  readonly title: string;
  readonly color: string;
  readonly userId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type Story = LazyLoading extends LazyLoadingDisabled ? EagerStory : LazyStory

export declare const Story: (new (init: ModelInit<Story>) => Story) & {
  copyOf(source: Story, mutator: (draft: MutableModel<Story>) => MutableModel<Story> | void): Story;
}