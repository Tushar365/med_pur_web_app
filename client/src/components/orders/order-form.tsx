import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, X, Plus, ShoppingCart } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderFormProps {
  orderId?: number;
  onSuccess?: () => void;
}

// Combined schema for the entire form
const orderFormSchema = z.object({
  customerId: z.coerce.number().positive("Please select a customer"),
  status: z.string().min(1, "Status is required"),
  items: z.array(
    z.object({
      productId: z.coerce.number().positive("Please select a product"),
      quantity: z.coerce.number().positive("Quantity must be positive"),
      price: z.coerce.number().positive("Price must be positive"),
      subtotal: z.coerce.number().positive("Subtotal must be positive"),
    })
  ).min(1, "At least one item is required"),
  total: z.coerce.number().positive("Total must be positive"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function OrderForm({ orderId, onSuccess }: OrderFormProps) {
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState(false);

  // Fetch customers for dropdown
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  // Fetch products for dropdown
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  // Fetch order details if in edit mode
  const { data: orderDetails, isLoading: orderLoading } = useQuery({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  useEffect(() => {
    setIsEdit(!!orderId);
  }, [orderId]);

  // Set default values based on if editing or creating
  const defaultValues: OrderFormValues = {
    customerId: 0,
    status: "pending",
    items: [
      {
        productId: 0,
        quantity: 1,
        price: 0,
        subtotal: 0,
      },
    ],
    total: 0,
  };

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
  });

  // Use field array for handling order items
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  // Update form when order details are loaded (edit mode)
  useEffect(() => {
    if (orderDetails && isEdit) {
      form.reset({
        customerId: orderDetails.customer_id,
        status: orderDetails.status,
        items: orderDetails.items.map((item: any) => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        })),
        total: orderDetails.total,
      });
    }
  }, [orderDetails, isEdit, form]);

  // Update price and subtotal when product or quantity changes
  const handleProductChange = (index: number, productId: number) => {
    if (products) {
      const product = products.find((p: any) => p.id === productId);
      if (product) {
        const quantity = form.getValues(`items.${index}.quantity`);
        const price = product.price;
        const subtotal = price * quantity;
        
        form.setValue(`items.${index}.price`, price);
        form.setValue(`items.${index}.subtotal`, subtotal);
        
        // Update total
        updateTotal();
      }
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const price = form.getValues(`items.${index}.price`);
    const subtotal = price * quantity;
    
    form.setValue(`items.${index}.subtotal`, subtotal);
    
    // Update total
    updateTotal();
  };

  // Calculate and update total
  const updateTotal = () => {
    const items = form.getValues("items");
    const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    form.setValue("total", total);
  };

  // Add a new item
  const addItem = () => {
    append({
      productId: 0,
      quantity: 1,
      price: 0,
      subtotal: 0,
    });
  };

  // Create new order
  const createMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      // Format data for API
      const orderData = {
        order: {
          customerId: data.customerId,
          status: data.status,
          total: data.total,
        },
        items: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        }))
      };
      
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] }); // Invalidate products as stock changes
      toast({
        title: "Order created",
        description: "The order has been successfully created",
      });
      form.reset(defaultValues);
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update order status
  const updateMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      if (!orderId) throw new Error("Order ID is required for updates");
      
      // For simplicity, we're just updating the status
      const res = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status: data.status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId] });
      toast({
        title: "Order updated",
        description: "The order status has been successfully updated",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrderFormValues) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || customersLoading || productsLoading || orderLoading;

  // Check if any product is out of stock
  const checkProductAvailability = (productId: number, quantity: number): boolean => {
    if (!products) return false;
    
    const product = products.find((p: any) => p.id === productId);
    if (!product) return false;
    
    return product.stock >= quantity;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Customer Selection */}
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select
                  disabled={isEdit || isPending}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value ? field.value.toString() : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Customers</SelectLabel>
                      {customersLoading ? (
                        <SelectItem value="loading" disabled>Loading customers...</SelectItem>
                      ) : customers && customers.length > 0 ? (
                        customers.map((customer: any) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No customers available</SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Order Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Order Items */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-base font-medium">Order Items</Label>
            {!isEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                disabled={isPending}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            )}
          </div>

          {fields.length === 0 ? (
            <Card>
              <CardContent className="p-4 flex justify-center items-center h-24 text-gray-500">
                No items added to this order
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Label className="text-sm font-medium">Item #{index + 1}</Label>
                      {!isEdit && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1 || isPending}
                          className="h-8 w-8 p-0 text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Product Selection */}
                      <div>
                        <Label htmlFor={`items.${index}.productId`} className="mb-2 block">
                          Product
                        </Label>
                        <Select
                          disabled={isEdit || isPending}
                          onValueChange={(value) => {
                            const productId = parseInt(value);
                            form.setValue(`items.${index}.productId`, productId);
                            handleProductChange(index, productId);
                          }}
                          value={form.getValues(`items.${index}.productId`).toString() || "0"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Products</SelectLabel>
                              {productsLoading ? (
                                <SelectItem value="loading" disabled>Loading products...</SelectItem>
                              ) : products && products.length > 0 ? (
                                products.map((product: any) => (
                                  <SelectItem 
                                    key={product.id} 
                                    value={product.id.toString()}
                                    disabled={product.stock <= 0 && !isEdit}
                                  >
                                    {product.name} {product.stock <= 0 && !isEdit ? "(Out of Stock)" : `(${product.stock} left)`}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="none" disabled>No products available</SelectItem>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.items?.[index]?.productId && (
                          <p className="text-sm font-medium text-destructive mt-1">
                            {form.formState.errors.items[index]?.productId?.message}
                          </p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div>
                        <Label htmlFor={`items.${index}.quantity`} className="mb-2 block">
                          Quantity
                        </Label>
                        <Input
                          id={`items.${index}.quantity`}
                          type="number"
                          min="1"
                          disabled={isEdit || isPending}
                          value={form.getValues(`items.${index}.quantity`)}
                          onChange={(e) => {
                            const quantity = parseInt(e.target.value) || 0;
                            form.setValue(`items.${index}.quantity`, quantity);
                            handleQuantityChange(index, quantity);
                          }}
                        />
                        {form.formState.errors.items?.[index]?.quantity && (
                          <p className="text-sm font-medium text-destructive mt-1">
                            {form.formState.errors.items[index]?.quantity?.message}
                          </p>
                        )}
                        {!isEdit && form.getValues(`items.${index}.productId`) > 0 && 
                          form.getValues(`items.${index}.quantity`) > 0 && 
                          !checkProductAvailability(
                            form.getValues(`items.${index}.productId`), 
                            form.getValues(`items.${index}.quantity`)
                          ) && (
                            <p className="text-sm font-medium text-destructive mt-1">
                              Not enough stock available
                            </p>
                          )
                        }
                      </div>

                      {/* Price */}
                      <div>
                        <Label htmlFor={`items.${index}.price`} className="mb-2 block">
                          Price
                        </Label>
                        <Input
                          id={`items.${index}.price`}
                          type="number"
                          min="0"
                          step="0.01"
                          readOnly
                          value={form.getValues(`items.${index}.price`).toFixed(2)}
                        />
                      </div>

                      {/* Subtotal */}
                      <div>
                        <Label htmlFor={`items.${index}.subtotal`} className="mb-2 block">
                          Subtotal
                        </Label>
                        <Input
                          id={`items.${index}.subtotal`}
                          type="number"
                          min="0"
                          step="0.01"
                          readOnly
                          value={form.getValues(`items.${index}.subtotal`).toFixed(2)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {form.formState.errors.items && !form.formState.errors.items[0] && (
            <p className="text-sm font-medium text-destructive mt-1">
              {form.formState.errors.items.message}
            </p>
          )}
        </div>

        {/* Order Total */}
        <div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <Label className="text-lg font-medium">Total:</Label>
            <div className="text-xl font-bold">
              ${form.getValues("total").toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => onSuccess && onSuccess()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Order" : "Create Order"}
            {!isPending && <ShoppingCart className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
