import React from "react";
import { Channel, ConnectedChannels } from "../../../hooks/useFetchChannels";
import { UseFormRegister } from "react-hook-form";
import { Check } from "../../../src/Icons";

interface ChannelSelectorProps {
    register: UseFormRegister<{
        title: string;
        description: string;
        selectedChannels: string[];
    }>;
    connectedChannels: ConnectedChannels | null;
}

const ChannelSelector = ({
    register,
    connectedChannels,
}: ChannelSelectorProps) => {
    return (
        <>
            {connectedChannels &&
                Object.entries(connectedChannels).map(
                    ([platform, channels]) => (
                        <div key={platform} className="space-y-2">
                            <label className="text-sm font-semibold text-dark">
                                {platform.charAt(0).toUpperCase() +
                                    platform.slice(1)}
                            </label>
                            <fieldset>
                                <div className="relative flex flex-col gap-3 p-3 border rounded-lg hover:bg-light shadow-sm">
                                    {/* Channels List */}
                                    {channels.map((channel: Channel) => (
                                        <div key={channel.channel_id}>
                                            <div className="space-y-5">
                                                <div className="flex gap-3">
                                                    <div className="flex h-6 shrink-0 items-center">
                                                        <div className="group grid size-4 grid-cols-1">
                                                            <input
                                                                defaultChecked
                                                                id="comments"
                                                                name="comments"
                                                                type="checkbox"
                                                                aria-describedby="comments-description"
                                                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-medium-light checked:border-primary-main checked:bg-primary-main indeterminate:border-primary-main indeterminate:bg-primary-main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main disabled:border-light disabled:bg-light disabled:checked:bg-light forced-colors:appearance-auto"
                                                            />
                                                            <Check />
                                                        </div>
                                                    </div>
                                                    <div className="text-sm/6">
                                                        <label
                                                            htmlFor="comments"
                                                            className="font-medium text-dark"
                                                        >
                                                            {
                                                                channel.channel_name
                                                            }
                                                        </label>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                    )
                )}
        </>
    );
};

export default ChannelSelector;
