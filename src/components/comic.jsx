import React from 'react';
import {useDispatch} from "react-redux";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {appendComic} from "../redux/slice/comicSlice";

const schema = yup
    .object({
        inputs: yup.string().required(),
    })
    .required();

export default function Comic() {
    const dispatch = useDispatch();

    const {
        register,
        setError,
        handleSubmit,
        reset,
        clearErrors,
        formState: {errors, isSubmitSuccessful, isDirty, isValid}
    } = useForm({resolver: yupResolver(schema)});

    const onSubmit = handleSubmit(async (data) => {
        let formURL = "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud";
        try {
            const response = await fetch(formURL, {
                method: "POST",
                headers: {
                    "Accept": "image/png",
                    "Authorization": `Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                const imageDataUrl = URL.createObjectURL(await response.blob());
                // console.log(await response.blob())
                console.log(imageDataUrl)
                dispatch(appendComic({name: data.inputs, image: imageDataUrl, time: new Date().getTime()}))
            } else {
                setError("root.random", {
                    message: "an error occurred while generating image",
                    type: "random",
                })
            }
        } catch (e) {
            console.error(e)
        }
    })

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset({inputs: ""})
            clearErrors()
        }
    }, [clearErrors, isSubmitSuccessful, reset])

    return (
        <div className="p-1 sm:p-4">
            <form onSubmit={onSubmit}>
                {errors.root?.random && <p role="alert" className={"text-rose-600"}>{errors.root?.random.message}</p>}
                <input
                   {...register("inputs")}
                   placeholder="Enter your folder name"
               />
                {errors.inputs && <p role="alert" className={"text-rose-600"}>{errors.inputs.message}</p>}
                <button type={"submit"}
                        className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"}
                        disabled={!isDirty || !isValid}>
                    Generate comic
                </button>

            </form>
            <img src={"blob:http://localhost:3000/8f8c5d03-98bd-42ac-94b4-6b19f47f3dd6"} alt="Comic" />
        </div>
    );
}
