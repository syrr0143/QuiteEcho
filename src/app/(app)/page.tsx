import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/message.json'
export default function Home() {
  function convertToLocaleTime(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleString(); // Converts to a string based on the user's locale
  }
  return (
    <div>
      <section>

      </section>
      <div className="w-full justify-center flex mt-12">
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {
              messages.map((item, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="items-center justify-center p-6">
                      <p className="text-xl ">{item.content}</p>
                      <p className="text-end mt-4 mr-2 font-semibold text-gray-500">{convertToLocaleTime(item.receivedDate)}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
                .reverse() // Reverse the order of items to display them from newest to oldest.
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
