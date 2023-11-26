import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {appendComic, setComics} from "../redux/slice/comicSlice";
import Card from "./card";

const schema = yup
    .object({
        inputs: yup.string().required(),
    })
    .required();

export default function Comic() {
    const dispatch = useDispatch();
    const [isGenerating, setIsGenerating] = React.useState(false);
    const cms = useSelector(state => state.comic.comics);
    const comics = [...cms].sort((a, b) => b.time - a.time)

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

    const handleClear = () => {
        dispatch(setComics([]))
    }

    React.useEffect(() => {
        if (isSubmitSuccessful) {
            reset({inputs: ""})
            clearErrors()
        }
    }, [clearErrors, isSubmitSuccessful, reset])

    React.useEffect(() => {
        dispatch(setComics([]))
    }, [])
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
                        <button type={"button"}
                                className={"bg-rose-600 border shadow rounded-lg px-2 py-1 border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400 ml-2"}
                                onClick={handleClear}
                                disabled={isGenerating}>
                            Delete Images
                        </button>
                    </div>
                </form>
            </div>
            <div className={"lg:pl-12 lg:w-3/4"}>
                {comics.length === 0 &&
                    <div className={"flex flex-col border p-4 rounded-lg text-center border-gray-400 my-2 shadow"}>
                        <h5 className={"font-medium text-rose-800 text-lg"}>there is no comic yet :(</h5>
                        <p>please generate one by entering a context in the input box</p>
                    </div>
                }
                {comics.length > 0 &&
                    <div className={"grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4"}>
                        {comics.map((comic, index) => (
                            <Card key={index} comic={comic}/>
                        ))}
                    </div>
                }
            </div>

        </div>
    );
}
