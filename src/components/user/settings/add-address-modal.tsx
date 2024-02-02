"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog"
import { Fieldset } from "@/components/ui/fieldset"
import { Input } from "@/components/ui/input"
import { TextArea } from "@/components/ui/text-area"
import { Dropdown, Option } from "@/components/dropdown"
import { addAddress } from "@/app/actions/user/settings"

const addressSchema = z.object({
  title: z.string(),
  phoneNumber: z.string(),
  notes: z.string(),
  street: z.string(),
  postCode: z.string(),
  recipient: z.string(),
})

type Address = z.infer<typeof addressSchema>

const provinceOptions: Option[] = [
  {
    label: "Banten",
    value: 1,
  },
]

const cityOptions: Option[] = [
  {
    label: "Cilegon",
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
  const [province, setProvince] = useState<Option>()
  const [city, setCity] = useState<Option>()
  const [district, setDistrict] = useState<Option>()

  const path = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<Address>()

  const onSubmit = form.handleSubmit(async (input) => {
    await toast.promise(
      addAddress({
        title: input.title,
        phoneNumber: input.phoneNumber,
        recipient: input.recipient,
        street: input.street,
        city: city?.label as string,
        province: province?.label as string,
        subdistrict: district?.label as string,
        additionalNotes: input.notes,
        postNumber: input.postCode,
        isMainAddress: false,
      }),
      {
        pending: "Adding address",
        error: "Error when adding address",
        success: "Succesfully add new address",
      }
    )

    router.replace(path)
  })

  return (
    <Dialog open onOpenChange={() => router.replace(path)}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          open={searchParams.get("add") !== undefined}
          className="h-[36rem] w-[30rem]"
        >
          <DialogHeader title="Add Address" />
          <form className="flex flex-col gap-2 p-4" onSubmit={onSubmit}>
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
                selectedOption={province}
                onOptionClick={(option) => setProvince(option)}
                isMulti={false}
                placeholder="Select Province"
              />
            </Fieldset>
            <Fieldset label="City">
              <Dropdown
                options={cityOptions}
                selectedOption={city}
                onOptionClick={(option) => setCity(option)}
                isMulti={false}
                placeholder="Select City"
              />
            </Fieldset>
            <Fieldset label="District">
              <Dropdown
                options={districtOptions}
                selectedOption={district}
                onOptionClick={(option) => setDistrict(option)}
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
                {...form.register("notes")}
              />
            </Fieldset>
            <Button variant="default">Submit</Button>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
