import React, { useEffect, useRef } from "react";
import { router, useForm, Head } from "@inertiajs/react";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import Chirp from "@/Components/Chirp";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Index({ auth, chirps }) {
    const timeoutRef = useRef(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
    });

    /**
     * @param {SubmitEvent} e
     */
    function handleSubmit(e) {
        e.preventDefault();

        post(route("chirps.store"), {
            onSuccess: () => reset(),
        });
    }

    function handleUpdate() {
        router.reload("chirps.index", {
            only: ["chirps"],
        });
        console.log("a");
    }

    useEffect(() => {
        timeoutRef.current = setInterval(handleUpdate, 1000 * 1);

        return () => {
            clearInterval(timeoutRef.current);
        };
    }, [timeoutRef]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chirps" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={(e) => setData("message", e.target.value)}
                    ></textarea>
                    <InputError message={errors.message} className="mt-2" />
                    <PrimaryButton className="mt-4" disabled={processing}>
                        Chirp
                    </PrimaryButton>
                </form>

                <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                    {chirps.map((chirp) => (
                        <Chirp key={chirp.id} chirp={chirp} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
