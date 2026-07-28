#include<iostream>
using namespace std;
class shape{
    protected:
    float area=0;
    public:
    virtual void calc_area(){

    };
    virtual void display(){};
};
class circle: public shape{
    protected:
    float radius;
    public:
    void calc_area(){
       area=3.14*radius*radius; 
   
       
    };
    circle(float radius ){
        this->radius=radius;
        calc_area();
    };
    
    void display(){
        cout<< "the area of the circle is: "<<area<<endl;
    };
    
};
class rectangle:public shape{
     protected:
     double length;
     double breadth;
     public:
     rectangle(double length, double breadth){
        this->length=length;
        this->breadth=breadth;
        calc_area();
     };
     void calc_area(){
        area=length*breadth;
     };
       
    
    void display(){
        cout<< "the area of the rectangle is: "<<area<<endl;
    };
};
    int main(){
        shape *a;
        a=new circle(9.8);
        a->display();
        a=new rectangle(2.8,6.9);
            a->display();
        return 0;


    }