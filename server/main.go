package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

type Cities struct {
	Cities []City `json:'cities'`
}

// User struct which contains a name
// a type and a list of social links
type City struct {
	English string `json:'english'`
	//Russian string `json:'russian'`
}

type Paper struct {
	Paper []News
}
type News struct {
	News string
}
type Pin struct {
	City        string
	Description string
}

//type person struct {
//	Name string `json:"name"`
//	Age  int    `json:"age"`
//}

//var dan *person = &person{
//	Name: "Dan",
//	Age:  28,
//}
func newsHandler(w http.ResponseWriter, r *http.Request) {
	ukr, err := os.Open("tmp/ukraine.json")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Opened ukraine.json")
	bytes, _ := ioutil.ReadAll(ukr)
	var cities []City
	err = json.Unmarshal(bytes, &cities)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(len(cities))
	for i := 0; i < len(cities); i++ {
		fmt.Println(cities[i].English)
		//fmt.Println(paper.Paper[i].Russian)
	}
	var news []string
	nws, err := os.Open("tmp/news.json")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Opened news.json")
	bytes, _ = ioutil.ReadAll(nws)
	err = json.Unmarshal(bytes, &news)
	if err != nil {
		fmt.Println(err)
		return
	}

	for i := 0; i < len(news); i++ {
		//fmt.Println(news[i])
		//fmt.Println(paper.Paper[i].Russian)
	}
	var pins []Pin
	for i := 0; i < len(news); i++ {
		for k := 0; k < len(cities); k++ {
			if strings.Contains(news[i], cities[k].English) {
				fmt.Println(news[i] + "::" + cities[k].English)
				pin := Pin{cities[k].English, news[i]}
				pins = append(pins, pin)
			}
		}
	}

	j, _ := json.Marshal(pins)

	w.Write(j)
}

func main() {
	http.HandleFunc("/myapp", newsHandler)

	log.Println("Go go power rangers!")

	http.ListenAndServe(":8080", nil)
}
