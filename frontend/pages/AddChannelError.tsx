import { ROUTES } from "../../shared/routes";

export function AddChannelError() {
    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold text-red-500">
                Error Connecting YouTube
            </h1>
            <p className="my-4">
                We were unable to connect your YouTube account. Please try
                again.
            </p>
            <button
                onClick={() => (window.location.href = ROUTES.ADD_CHANNELS)}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Retry
            </button>
        </div>
    );
};