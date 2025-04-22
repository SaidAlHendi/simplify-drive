import React, { Dispatch, SetStateAction } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
type Props = {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
}

const formSchema = z.object({
  query: z.string().min(0).max(200),
})
const SearchBar = ({ query, setQuery }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: query,
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setQuery(values.query)
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 flex gap-2 '
        >
          <FormField
            control={form.control}
            name='query'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder='Your file names... ' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={form.formState.isSubmitting}
            className='flex gap-1'
          >
            {form.formState.isSubmitting && (
              <Loader2 className='h-4 w-4 animate-spin' />
            )}
            <Search /> Search
          </Button>{' '}
        </form>
      </Form>
    </div>
  )
}

export default SearchBar
