import { ROUTES } from "../../shared/routes";

export function AddChannelSuccess() {
    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold">YouTube Connected</h1>
            <p className="my-4">
                Your YouTube account has been successfully linked to your
                ClipBot profile.
            </p>
            <button
                onClick={() => (window.location.href = ROUTES.HOME)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Go to Dashboard
            </button>
        </div>
    );
};