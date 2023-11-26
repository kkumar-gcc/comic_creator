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
    const [isGenerating, setIsGenerating] = React.useState(false);
    const {
        register,
        setError,
        handleSubmit,
        reset,
        clearErrors,
        formState: {errors, isSubmitSuccessful, isDirty, isValid}
    } = useForm({resolver: yupResolver(schema)});

    const onSubmit = handleSubmit(async (data) => {
        setIsGenerating(true)
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
        } finally {
            setIsGenerating(false)
        }
    })

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset({inputs: ""})
            clearErrors()
        }
    }, [clearErrors, isSubmitSuccessful, reset])

    return (
        <div className="p-2 sm:p-4 flex flex-col lg:flex-row">
            <div className={"flex-1 lg:w-1/3"}>
                <form onSubmit={onSubmit} className={"flex flex-col sticky"}>
                    {errors.root?.random &&
                        <p role="alert" className={"text-rose-600"}>{errors.root?.random.message}</p>}
                    <div className={"my-2 w-full"}>
                        <textarea
                            className={"border shadow rounded-lg px-2 py-1.5 border-gray-600 w-full outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-600"}
                            {...register("inputs")}
                            placeholder="Enter context for comic"
                        />
                    </div>
                    {errors.inputs && <p role="alert" className={"text-rose-600"}>{errors.inputs.message}</p>}
                    <div className={"flex flex-row justify-end"}>
                        <button type={"submit"}
                                className={"bg-rose-600 border shadow rounded-lg px-2 py-1 border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"}
                                disabled={!isDirty || !isValid}>
                            {isGenerating ? "Generating..." : "Generate comic"}
                        </button>
                    </div>
                </form>
            </div>
            <div className={"lg:pl-12 lg:w-3/4"}>
                <div className={"flex flex-col border p-4 rounded-lg text-center border-gray-600 my-2"}>
                    <h5 className={"font-medium text-rose-800 text-lg"}>there is no comic yet :(</h5>
                    <p>please generate one by entering a context in the input box</p>
                </div>
            </div>

            {/*<img src={"blob:http://localhost:3000/8f8c5d03-98bd-42ac-94b4-6b19f47f3dd6"} alt="Comic" />*/}
        </div>
    );
}
