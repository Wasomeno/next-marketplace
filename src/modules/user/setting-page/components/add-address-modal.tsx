"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { addAddress } from "@/actions/user/settings"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useForm } from "react-hook-form"
import { BiPlus } from "react-icons/bi"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "react-toastify"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { Dropdown, Option } from "@/components/dropdown"

const createAddressFormSchema = z.object({
  title: z.string().min(5, "Title must have at least 5 characters"),
  phoneNumber: z
    .string()
    .regex(
      RegExp("^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"),
      "Phone number not valid"
    ),
  notes: z
    .string()
    .min(15, "Notes must have at least 15 characters")
    .optional()
    .default(""),
  street: z.string().min(5, "Street must have at least 5 characters"),
  postCode: z.string().min(5, "Post Code must have at least 5 characters"),
  recipient: z
    .string()
    .min(5, "Recipient name must have at least 5 characters"),
  district: z.string().min(1, "District required"),
  city: z.string().min(1, "City required"),
  province: z.string().min(1, "Province required"),
})

type CreateAddressFormData = z.infer<typeof createAddressFormSchema>

const provinceOptions: Option[] = [
  {
    label: "Banten",
    value: 1,
  },
]

const districtOptions: Option[] = [
  {
    label: "Cilegon",
    value: 1,
  },
]

export function AddAddressModal() {
  const cities = useQuery<Option[]>({
    queryFn: () =>
      axios.get("/cities.json").then((response) =>
        response.data.map((city: any) => ({
          label: city.city_name,
          value: city.city_id,
        }))
      ),
    queryKey: ["cities"],
  })

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<CreateAddressFormData>({
    resolver: zodResolver(createAddressFormSchema),
  })

  const selectedProvince = form.watch("province")
  const selectedCity = form.watch("city")
  const selectedDistrict = form.watch("district")

  const isOpen = searchParams.get("add") !== null

  function onOpenChange(isOpen: boolean) {
    const urlSearchParams = new URLSearchParams(searchParams)

    if (isOpen) {
      urlSearchParams.set("add", "true")
      router.replace(`${pathname}?${urlSearchParams.toString()}`)
      return
    }

    urlSearchParams.delete("add")
    router.replace(`${pathname}?${urlSearchParams.toString()}`)
  }

  const addAddressMutation = useMutation({
    mutationFn: async (formData: CreateAddressFormData) => {
      await addAddress({
        title: formData.title,
        phoneNumber: formData.phoneNumber,
        recipient: formData.recipient,
        street: formData.street,
        city: formData.city,
        province: formData.province,
        subdistrict: formData.district,
        additionalNotes: formData?.notes,
        postNumber: formData.postCode,
        isMainAddress: false,
      })
    },
    onSuccess: () => {
      router.replace(`${pathname}`)
      toast.success("Succesfully add new address")
    },
    onError: () => toast.error("Error when adding new address"),
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <BiPlus /> Create
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent open={isOpen} className="h-[36rem] w-full lg:w-[30rem]">
          <DialogHeader title="Add Address" />
          <form
            className="flex flex-col gap-4 p-4"
            onSubmit={form.handleSubmit((formData) =>
              addAddressMutation.mutate(formData)
            )}
          >
            <Fieldset label="Title" error={form.formState.errors.title}>
              <Input
                type="text"
                placeholder="Title"
                {...form.register("title")}
              />
            </Fieldset>
            <Fieldset label="Recipient" error={form.formState.errors.recipient}>
              <Input
                type="text"
                placeholder="Recipient Name"
                {...form.register("recipient")}
              />
            </Fieldset>
            <Fieldset
              label="Phone Number"
              error={form.formState.errors.phoneNumber}
            >
              <Input
                type="text"
                placeholder="Recipient phone number "
                {...form.register("phoneNumber")}
              />
            </Fieldset>
            <Fieldset label="Province" error={form.formState.errors.province}>
              <Dropdown
                options={provinceOptions}
                selectedOption={provinceOptions.find(
                  (option) => option.label === selectedProvince
                )}
                onOptionClick={(option) =>
                  form.setValue("province", option.label, {
                    shouldValidate: true,
                  })
                }
                deselectOption={() => form.setValue("province", "")}
                placeholder="Select Province"
              />
            </Fieldset>
            <Fieldset label="City" error={form.formState.errors.city}>
              <Dropdown
                options={cities.data}
                selectedOption={cities.data?.find(
                  (option) => option.label === selectedCity
                )}
                onOptionClick={(option) =>
                  form.setValue("city", option.label, { shouldValidate: true })
                }
                deselectOption={() => form.setValue("city", "")}
                placeholder="Select City"
              />
            </Fieldset>
            <Fieldset label="District" error={form.formState.errors.district}>
              <Dropdown
                options={districtOptions}
                selectedOption={districtOptions.find(
                  (option) => option.label === selectedDistrict
                )}
                onOptionClick={(option) =>
                  form.setValue("district", option.label, {
                    shouldValidate: true,
                  })
                }
                deselectOption={() => form.setValue("district", "")}
                placeholder="Select District"
              />
            </Fieldset>
            <Fieldset label="Street" error={form.formState.errors.street}>
              <Input
                type="text"
                placeholder="Street"
                {...form.register("street")}
              />
            </Fieldset>
            <Fieldset label="Post Code" error={form.formState.errors.postCode}>
              <Input
                type="text"
                placeholder="Your post code"
                {...form.register("postCode")}
              />
            </Fieldset>
            <Fieldset label="Notes" error={form.formState.errors.notes}>
              <TextArea
                placeholder="Additional notes"
                className="h-36"
                {...form.register("notes")}
              />
            </Fieldset>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="w-full text-white lg:w-32 lg:text-xs"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                className="w-full lg:w-32 lg:text-xs"
                disabled={addAddressMutation.isPending}
              >
                {addAddressMutation.isPending && (
                  <ImSpinner8 size={14} className="animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
