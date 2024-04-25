"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { addAddress } from "@/actions/user/settings"
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

const addressSchema = z.object({
  title: z.string(),
  phoneNumber: z.string(),
  notes: z.string(),
  street: z.string(),
  postCode: z.string(),
  recipient: z.string(),
  district: z.string(),
  city: z.string(),
  province: z.string(),
})

type Address = z.infer<typeof addressSchema>

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

  const form = useForm<Address>()

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
    mutationFn: form.handleSubmit(async (input) => {
      addAddress({
        title: input.title,
        phoneNumber: input.phoneNumber,
        recipient: input.recipient,
        street: input.street,
        city: input.city,
        province: input.province,
        subdistrict: input.district,
        additionalNotes: input.notes,
        postNumber: input.postCode,
        isMainAddress: false,
      }),
        router.replace(`${pathname}`)
    }),
    onSuccess: () => toast.success("Succesfully add new address"),
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
            className="flex flex-col gap-2 p-4"
            onSubmit={addAddressMutation.mutate}
          >
            <Fieldset label="Title">
              <Input
                type="text"
                placeholder="Title"
                {...form.register("title")}
              />
            </Fieldset>
            <Fieldset label="Recipient">
              <Input
                type="text"
                placeholder="Recipient Name"
                {...form.register("recipient")}
              />
            </Fieldset>
            <Fieldset label="Phone Number">
              <Input
                type="text"
                placeholder="Recipient phone number "
                {...form.register("phoneNumber")}
              />
            </Fieldset>
            <Fieldset label="Province">
              <Dropdown
                options={provinceOptions}
                selectedOption={provinceOptions.find(
                  (option) => option.label === selectedProvince
                )}
                onOptionClick={(option) =>
                  form.setValue("province", option.label)
                }
                deselectOption={() => form.setValue("province", "")}
                isMulti={false}
                placeholder="Select Province"
              />
            </Fieldset>
            <Fieldset label="City">
              <Dropdown
                options={cities.data}
                selectedOption={cities.data?.find(
                  (option) => option.label === selectedCity
                )}
                onOptionClick={(option) => form.setValue("city", option.label)}
                deselectOption={() => form.setValue("city", "")}
                isMulti={false}
                placeholder="Select City"
              />
            </Fieldset>
            <Fieldset label="District">
              <Dropdown
                options={districtOptions}
                selectedOption={districtOptions.find(
                  (option) => option.label === selectedDistrict
                )}
                onOptionClick={(option) =>
                  form.setValue("district", option.label)
                }
                deselectOption={() => form.setValue("district", "")}
                isMulti={false}
                placeholder="Select District"
              />
            </Fieldset>
            <Fieldset label="Street">
              <Input
                type="text"
                placeholder="Street"
                {...form.register("street")}
              />
            </Fieldset>
            <Fieldset label="Post Code">
              <Input
                type="text"
                placeholder="Your post code"
                {...form.register("postCode")}
              />
            </Fieldset>
            <Fieldset label="Notes">
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
