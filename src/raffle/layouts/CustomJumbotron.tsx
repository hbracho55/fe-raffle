
interface Props {
    title: string,
    awards: string,
    payment: string,
    description?: string,
    description2?: string,
    award1?: string,
    award2?: string,
    award3?: string,
}

export const CustomJumbotron = ({title, awards, payment, description, description2, award1, award2, award3 }: Props) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-violet-600 mb-5">
        {title}
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {description}
      </p>
      <p><br /></p>
      <h6 className="text-2xl font-bold text-gray-600 mb-5">
        {awards}
      </h6>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {award1}
      </p>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {award2}
      </p>
       <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {award3}
      </p>
      <p><br /></p>
      <h6 className="text-2xl font-bold text-gray-600 mb-5">
        {payment}
      </h6>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {description2}
      </p>
    </div>
  )
}
